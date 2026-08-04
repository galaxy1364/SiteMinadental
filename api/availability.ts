import type { VercelRequest,VercelResponse } from '@vercel/node';
import { pool } from '../server/db.js';

export default async function handler(req:VercelRequest,res:VercelResponse){
 const requestId=String(req.headers['x-request-id']||crypto.randomUUID());res.setHeader('Cache-Control','no-store');res.setHeader('X-Request-Id',requestId);
 if(req.method!=='GET')return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
 if(!process.env.DATABASE_URL)return res.status(503).json({ok:false,code:'DATABASE_NOT_CONFIGURED',requestId});
 const date=String(req.query.date||'');if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return res.status(422).json({ok:false,code:'INVALID_DATE',requestId});
 try{
  const result=await pool.query(`WITH day AS (SELECT $1::date d), rules AS (
    SELECT * FROM clinic_schedule s,day WHERE s.jalali_date IS NULL AND s.weekday=EXTRACT(DOW FROM day.d)::int
    UNION ALL SELECT * FROM clinic_schedule s,day WHERE s.jalali_date IS NOT NULL AND to_date(s.jalali_date,'YYYY/MM/DD')=day.d
  ), slots AS (
    SELECT r.id,gs slot_start,gs+make_interval(mins=>r.slot_minutes) slot_end,r.capacity
    FROM rules r CROSS JOIN LATERAL generate_series(day_start($1::date,r.starts_at),day_start($1::date,r.ends_at)-make_interval(mins=>r.slot_minutes),make_interval(mins=>r.slot_minutes)) gs
    WHERE NOT r.is_closed
  )
  SELECT slot_start,slot_end,capacity-GREATEST(0,(SELECT count(*) FROM appointment a WHERE a.status IN ('pending','confirmed','arrived') AND tstzrange(a.starts_at,a.ends_at,'[)')&&tstzrange(slots.slot_start,slots.slot_end,'[)'))) remaining
  FROM slots ORDER BY slot_start`,[date]);
  return res.status(200).json({ok:true,date,slots:result.rows.filter((x:any)=>Number(x.remaining)>0),requestId});
 }catch(error){console.error('availability_failed',{requestId,error});return res.status(500).json({ok:false,code:'AVAILABILITY_FAILED',requestId});}
}