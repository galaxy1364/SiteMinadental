import type { VercelRequest,VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { pool } from '../../server/db.js';
import { authenticate } from '../../server/security.js';

const Input=z.object({endpoint:z.string().url().max(2000),keys:z.object({p256dh:z.string().min(20).max(500),auth:z.string().min(8).max(200)}),locale:z.string().max(20).default('fa-IR')});

export default async function handler(req:VercelRequest,res:VercelResponse){
  const requestId=String(req.headers['x-request-id']||crypto.randomUUID());
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Request-Id',requestId);
  if(req.method!=='POST') return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
  if(!process.env.DATABASE_URL||!process.env.VAPID_PUBLIC_KEY||!process.env.VAPID_PRIVATE_KEY) return res.status(503).json({ok:false,code:'PUSH_NOT_CONFIGURED',requestId});
  try{
    const actor=await authenticate(req);
    const parsed=Input.safeParse(req.body);
    if(!parsed.success) return res.status(422).json({ok:false,code:'VALIDATION_ERROR',issues:parsed.error.issues,requestId});
    await pool.query(
      `INSERT INTO push_subscription(user_id,endpoint,p256dh,auth,locale,enabled)
       VALUES($1,$2,$3,$4,$5,true)
       ON CONFLICT(endpoint) DO UPDATE SET user_id=EXCLUDED.user_id,p256dh=EXCLUDED.p256dh,auth=EXCLUDED.auth,locale=EXCLUDED.locale,enabled=true,updated_at=now()`,
      [actor.userId,parsed.data.endpoint,parsed.data.keys.p256dh,parsed.data.keys.auth,parsed.data.locale]
    );
    await pool.query(`INSERT INTO audit_log(actor_user_id,actor_type,action,entity_type,entity_id,request_id,after_data,integrity_hash) VALUES($1,'patient','push.subscribe','push_subscription',$2,$3,$4::jsonb,encode(digest($1||$2||$3||$4,'sha256'),'hex'))`,[actor.userId,parsed.data.endpoint,requestId,JSON.stringify({locale:parsed.data.locale})]);
    return res.status(201).json({ok:true,requestId});
  }catch(error){const code=error instanceof Error?error.message:'PUSH_SUBSCRIBE_FAILED';return res.status(code==='UNAUTHENTICATED'?401:500).json({ok:false,code,requestId});}
}
