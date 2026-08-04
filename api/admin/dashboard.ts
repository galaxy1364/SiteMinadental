import type { VercelRequest,VercelResponse } from '@vercel/node';
import { pool,healthCheck } from '../../server/db.js';
import { authenticate,requireRole } from '../../server/security.js';

const configured=(...keys:string[])=>keys.every(k=>Boolean(process.env[k]));
export default async function handler(req:VercelRequest,res:VercelResponse){
  const requestId=String(req.headers['x-request-id']||crypto.randomUUID());res.setHeader('Cache-Control','no-store');res.setHeader('X-Request-Id',requestId);
  if(req.method!=='GET')return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
  try{
    const actor=await authenticate(req);requireRole(actor,['owner','admin','secretary','doctor','finance','marketing']);
    const [db,metrics,schedule,queue,conversations,campaigns,users,backups]=await Promise.all([
      healthCheck(),
      pool.query(`SELECT
        (SELECT count(*)::int FROM appointment WHERE starts_at::date=current_date) appointments_today,
        (SELECT count(*)::int FROM outbox_message WHERE status='pending') queue_pending,
        (SELECT count(*)::int FROM conversation WHERE status IN ('open','handoff')) open_conversations,
        (SELECT count(*)::int FROM system_backup WHERE status='verified') verified_backups`),
      pool.query(`SELECT id,weekday,jalali_date,starts_at,ends_at,capacity,is_closed,version FROM clinic_schedule ORDER BY jalali_date NULLS LAST,weekday LIMIT 100`),
      pool.query(`SELECT id,channel,recipient,template_code,status,attempts,available_at,last_error FROM outbox_message ORDER BY created_at DESC LIMIT 100`),
      pool.query(`SELECT c.id,c.channel,c.status,p.full_name patient_name,
        (SELECT body FROM conversation_message m WHERE m.conversation_id=c.id ORDER BY created_at DESC LIMIT 1) last_message
        FROM conversation c LEFT JOIN patient p ON p.id=c.patient_id ORDER BY c.updated_at DESC LIMIT 100`),
      pool.query(`SELECT id,title,code,discount_type,discount_value,starts_at,ends_at,enabled FROM campaign ORDER BY created_at DESC LIMIT 100`),
      pool.query(`SELECT u.id,u.display_name,u.mobile,u.status,COALESCE(array_agg(r.code) FILTER(WHERE r.code IS NOT NULL),'{}') roles
        FROM app_user u LEFT JOIN user_role ur ON ur.user_id=u.id LEFT JOIN role r ON r.id=ur.role_id
        GROUP BY u.id ORDER BY u.created_at DESC LIMIT 100`),
      pool.query(`SELECT id,provider,checksum_sha256,encrypted,status,created_at FROM system_backup ORDER BY created_at DESC LIMIT 100`)
    ]);
    const m=metrics.rows[0];
    return res.status(200).json({ok:true,requestId,metrics:{appointmentsToday:m.appointments_today,queuePending:m.queue_pending,openConversations:m.open_conversations,verifiedBackups:m.verified_backups},services:{database:{ok:true,message:`${db.latencyMs}ms`},sms:{configured:configured('SMS_ENDPOINT','SMS_API_KEY')},push:{configured:configured('VAPID_PUBLIC_KEY','VAPID_PRIVATE_KEY','VAPID_SUBJECT')},ai:{configured:configured('OPENAI_API_KEY')},minadent:{configured:configured('MINADENT_API_URL','MINADENT_CLIENT_SECRET')},backup:{configured:configured('BACKUP_ENDPOINT','BACKUP_ENCRYPTION_KEY')},outbox:{ok:true,message:`${m.queue_pending} pending`}},schedule:schedule.rows,queue:queue.rows,conversations:conversations.rows,campaigns:campaigns.rows,users:users.rows,backups:backups.rows});
  }catch(error:any){const code=String(error?.message||'DASHBOARD_FAILED');const status=code==='UNAUTHENTICATED'?401:code==='FORBIDDEN'?403:500;return res.status(status).json({ok:false,code,requestId});}
}