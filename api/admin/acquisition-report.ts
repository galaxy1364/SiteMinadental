import type { VercelRequest,VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { pool } from '../../server/db.js';
import { authenticate,requireRole } from '../../server/security.js';

const Query=z.object({from:z.string().datetime({offset:true}),to:z.string().datetime({offset:true}),channel:z.string().max(80).optional()}).refine(v=>Date.parse(v.to)>Date.parse(v.from),{message:'INVALID_RANGE'});

export default async function handler(req:VercelRequest,res:VercelResponse){
  const requestId=String(req.headers['x-request-id']||crypto.randomUUID());
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Request-Id',requestId);
  if(req.method!=='GET') return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
  if(!process.env.DATABASE_URL) return res.status(503).json({ok:false,code:'BACKEND_NOT_CONFIGURED',requestId});
  try{
    const actor=await authenticate(req);requireRole(actor,['owner','clinic_admin','marketing','finance']);
    const parsed=Query.safeParse(req.query);
    if(!parsed.success) return res.status(422).json({ok:false,code:'VALIDATION_ERROR',issues:parsed.error.issues,requestId});
    const {from,to,channel}=parsed.data;
    const result=await pool.query(
      `SELECT COALESCE(ca.source,a.source_channel,'direct') AS source,
              COUNT(DISTINCT ca.patient_id) FILTER (WHERE ca.patient_id IS NOT NULL) AS leads,
              COUNT(DISTINCT a.id) AS bookings,
              COUNT(DISTINCT a.id) FILTER (WHERE a.status IN ('arrived','completed')) AS attended,
              COALESCE(SUM(ca.cost),0)::numeric(14,2) AS cost,
              COALESCE(SUM(ca.revenue),0)::numeric(14,2) AS revenue,
              CASE WHEN COALESCE(SUM(ca.cost),0)>0 THEN ROUND((SUM(ca.revenue)-SUM(ca.cost))/SUM(ca.cost)*100,2) ELSE NULL END AS roi_percent,
              CASE WHEN COUNT(DISTINCT a.id) FILTER (WHERE a.status IN ('arrived','completed'))>0 THEN ROUND(COALESCE(SUM(ca.cost),0)/COUNT(DISTINCT a.id) FILTER (WHERE a.status IN ('arrived','completed')),2) ELSE NULL END AS cost_per_attended_patient
       FROM campaign_attribution ca
       FULL JOIN appointment a ON a.id=ca.appointment_id
       WHERE COALESCE(ca.created_at,a.created_at) >= $1 AND COALESCE(ca.created_at,a.created_at) < $2
         AND ($3::text IS NULL OR COALESCE(ca.source,a.source_channel,'direct')=$3)
       GROUP BY COALESCE(ca.source,a.source_channel,'direct') ORDER BY revenue DESC,cost ASC`,
      [from,to,channel||null]
    );
    const integrations={googleAds:Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN),meta:Boolean(process.env.META_ACCESS_TOKEN),bale:Boolean(process.env.BALE_BOT_TOKEN),eitaa:Boolean(process.env.EITAA_BOT_TOKEN),rubika:Boolean(process.env.RUBIKA_BOT_TOKEN)};
    return res.status(200).json({ok:true,range:{from,to},rows:result.rows,integrations,requestId});
  }catch(error){const code=error instanceof Error?error.message:'REPORT_FAILED';return res.status(code==='UNAUTHENTICATED'?401:code==='FORBIDDEN'?403:500).json({ok:false,code,requestId});}
}
