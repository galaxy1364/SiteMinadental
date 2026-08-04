import type { VercelRequest,VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { pool,withTransaction } from '../../server/db.js';
import { authenticate,requireRole } from '../../server/security.js';

const ScheduleItem=z.object({
  id:z.string().uuid().optional(), weekday:z.number().int().min(0).max(6).nullable().optional(),
  jalaliDate:z.string().regex(/^\d{4}\/\d{2}\/\d{2}$/).nullable().optional(),
  startsAt:z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(), endsAt:z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  slotMinutes:z.number().int().min(5).max(240), capacity:z.number().int().min(0).max(100), isClosed:z.boolean(), version:z.number().int().positive().optional()
}).refine(v=>v.weekday!=null||v.jalaliDate!=null,{message:'WEEKDAY_OR_DATE_REQUIRED'});

export default async function handler(req:VercelRequest,res:VercelResponse){
  const requestId=String(req.headers['x-request-id']||crypto.randomUUID());
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Request-Id',requestId);
  if(!process.env.DATABASE_URL) return res.status(503).json({ok:false,code:'BACKEND_NOT_CONFIGURED',requestId});
  try{
    const actor=await authenticate(req); requireRole(actor,['owner','clinic_admin','secretary']);
    if(req.method==='GET'){
      const rows=await pool.query(`SELECT id,weekday,jalali_date,starts_at,ends_at,slot_minutes,capacity,is_closed,source,version,updated_at FROM clinic_schedule ORDER BY jalali_date NULLS LAST,weekday,starts_at`);
      return res.status(200).json({ok:true,items:rows.rows,requestId});
    }
    if(req.method!=='PUT') return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
    const parsed=z.array(ScheduleItem).min(1).max(100).safeParse(req.body?.items);
    if(!parsed.success) return res.status(422).json({ok:false,code:'VALIDATION_ERROR',issues:parsed.error.issues,requestId});
    const result=await withTransaction(async client=>{
      const changed=[];
      for(const item of parsed.data){
        const row=await client.query(
          `INSERT INTO clinic_schedule(id,weekday,jalali_date,starts_at,ends_at,slot_minutes,capacity,is_closed,source,version,updated_by)
           VALUES(COALESCE($1::uuid,gen_random_uuid()),$2,$3,$4,$5,$6,$7,$8,'minadent',1,$9)
           ON CONFLICT(id) DO UPDATE SET weekday=EXCLUDED.weekday,jalali_date=EXCLUDED.jalali_date,starts_at=EXCLUDED.starts_at,ends_at=EXCLUDED.ends_at,slot_minutes=EXCLUDED.slot_minutes,capacity=EXCLUDED.capacity,is_closed=EXCLUDED.is_closed,version=clinic_schedule.version+1,updated_by=$9,updated_at=now()
           WHERE clinic_schedule.version=COALESCE($10,clinic_schedule.version)
           RETURNING *`,
          [item.id||null,item.weekday??null,item.jalaliDate??null,item.startsAt??null,item.endsAt??null,item.slotMinutes,item.capacity,item.isClosed,actor.userId,item.version??null]
        );
        if(!row.rowCount) throw new Error('VERSION_CONFLICT');
        changed.push(row.rows[0]);
      }
      await client.query(`INSERT INTO audit_log(actor_user_id,actor_type,action,entity_type,request_id,after_data,integrity_hash) VALUES($1,'staff','schedule.update','clinic_schedule',$2,$3::jsonb,encode(digest($1||$2||$3,'sha256'),'hex'))`,[actor.userId,requestId,JSON.stringify(changed)]);
      return changed;
    });
    return res.status(200).json({ok:true,items:result,requestId});
  }catch(error){const code=error instanceof Error?error.message:'SCHEDULE_FAILED';return res.status(code==='UNAUTHENTICATED'?401:code==='FORBIDDEN'?403:code==='VERSION_CONFLICT'?409:500).json({ok:false,code,requestId});}
}
