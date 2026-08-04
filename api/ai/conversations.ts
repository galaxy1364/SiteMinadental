import type { VercelRequest,VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { pool,withTransaction } from '../../server/db.js';
import { authenticate,rateLimit } from '../../server/security.js';

const Input=z.object({conversationId:z.string().uuid().optional(),message:z.string().trim().min(1).max(4000),consentAi:z.literal(true),channel:z.enum(['website','pwa','instagram','bale','eitaa','rubika']).default('website')});
const blocked=/(نسخه|دوز|دارو تجویز|تشخیص قطعی|درمان قطعی)/i;

export default async function handler(req:VercelRequest,res:VercelResponse){
  const requestId=String(req.headers['x-request-id']||crypto.randomUUID());
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Request-Id',requestId);
  if(req.method!=='POST') return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
  if(!process.env.DATABASE_URL||!process.env.OPENAI_API_KEY) return res.status(503).json({ok:false,code:'AI_NOT_CONFIGURED',requestId});
  try{
    const actor=await authenticate(req);
    const limit=await rateLimit(`ai:user:${actor.userId}`,30,3600);
    if(!limit.allowed) return res.status(429).json({ok:false,code:'RATE_LIMITED',requestId});
    const parsed=Input.safeParse(req.body);
    if(!parsed.success) return res.status(422).json({ok:false,code:'VALIDATION_ERROR',issues:parsed.error.issues,requestId});
    if(blocked.test(parsed.data.message)) return res.status(422).json({ok:false,code:'MEDICAL_SAFETY_BOUNDARY',message:'دستیار اجازه تشخیص قطعی یا تجویز دارو ندارد.',requestId});

    const prepared=await withTransaction(async client=>{
      const patient=await client.query(`SELECT id,consent_ai FROM patient WHERE user_id=$1`,[actor.userId]);
      if(!patient.rowCount) throw new Error('PATIENT_PROFILE_REQUIRED');
      if(!patient.rows[0].consent_ai){
        await client.query(`UPDATE patient SET consent_ai=true,updated_at=now() WHERE id=$1`,[patient.rows[0].id]);
      }
      let conversationId=parsed.data.conversationId;
      if(conversationId){
        const owned=await client.query(`SELECT 1 FROM conversation WHERE id=$1 AND patient_id=$2`,[conversationId,patient.rows[0].id]);
        if(!owned.rowCount) throw new Error('CONVERSATION_NOT_FOUND');
      }else{
        const c=await client.query(`INSERT INTO conversation(patient_id,channel) VALUES($1,$2) RETURNING id`,[patient.rows[0].id,parsed.data.channel]);
        conversationId=c.rows[0].id;
      }
      await client.query(`INSERT INTO conversation_message(conversation_id,sender_type,body) VALUES($1,'patient',$2)`,[conversationId,parsed.data.message]);
      return {conversationId,patientId:patient.rows[0].id};
    });

    // Provider call intentionally isolated behind an environment-configured gateway.
    const response=await fetch(process.env.AI_GATEWAY_URL||'https://api.openai.com/v1/responses',{
      method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.OPENAI_API_KEY}`},
      body:JSON.stringify({model:process.env.AI_MODEL||'gpt-5-mini',input:[{role:'system',content:'You are a Persian dental clinic assistant. Never diagnose, prescribe, or promise outcomes. Help with services, booking, location, and safe escalation.'},{role:'user',content:parsed.data.message}]})
    });
    if(!response.ok) throw new Error(`AI_PROVIDER_${response.status}`);
    const data:any=await response.json();
    const answer=String(data.output_text||data.output?.[0]?.content?.[0]?.text||'').trim();
    if(!answer) throw new Error('AI_EMPTY_RESPONSE');
    await pool.query(`INSERT INTO conversation_message(conversation_id,sender_type,body,model,safety_flags) VALUES($1,'assistant',$2,$3,$4::jsonb)`,[prepared.conversationId,answer,process.env.AI_MODEL||'gpt-5-mini',JSON.stringify({medicalBoundary:true})]);
    return res.status(200).json({ok:true,conversationId:prepared.conversationId,answer,requestId});
  }catch(error){const code=error instanceof Error?error.message:'AI_FAILED';return res.status(code==='UNAUTHENTICATED'?401:code==='CONVERSATION_NOT_FOUND'?404:code==='PATIENT_PROFILE_REQUIRED'?409:502).json({ok:false,code,requestId});}
}
