import type { VercelRequest,VercelResponse } from '@vercel/node';
import { pool } from '../server/db.js';

export default async function handler(req:VercelRequest,res:VercelResponse){
 const requestId=String(req.headers['x-request-id']||crypto.randomUUID());
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Request-Id',requestId);
 if(req.method!=='GET')return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
 if(!process.env.DATABASE_URL)return res.status(503).json({ok:false,code:'DATABASE_NOT_CONFIGURED',requestId});
 const date=String(req.query.date||'');const jalaliDate=String(req.query.jalaliDate||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return res.status(422).json({ok:false,code:'INVALID_DATE',requestId});
 if(jalaliDate&&!/^\d{4}\/\d{2}\/\d{2}$/.test(jalaliDate))return res.status(422).json({ok:false,code:'INVALID_JALALI_DATE',requestId});
 try{
  const result=await pool.query(`WITH rules AS (
    SELECT s.* FROM clinic_schedule s
    WHERE (s.jalali_date=$2 AND $2<>'')
       OR (s.jalali_date IS NULL AND s.weekday=((EXTRACT(DOW FROM $1::date)::int+1)%7))
  ), effective_rules AS (
    SELECT * FROM rules
    WHERE jalali_date IS NOT NULL
    UNION ALL
    SELECT * FROM rules WHERE jalali_date IS NULL
      AND NOT EXISTS(SELECT 1 FROM rules x WHERE x.jalali_date IS NOT NULL)
  ), slots AS (
    SELECT r.id,
      gs AS slot_start,
      gs+make_interval(mins=>r.slot_minutes) AS slot_end,
      r.capacity
    FROM effective_rules r
    CROSS JOIN LATERAL generate_series(
      (($1::date+r.starts_at) AT TIME ZONE 'Asia/Tehran'),
      (($1::date+r.ends_at) AT TIME ZONE 'Asia/Tehran')-make_interval(mins=>r.slot_minutes),
      make_interval(mins=>r.slot_minutes)
    ) gs
    WHERE NOT r.is_closed AND r.starts_at IS NOT NULL AND r.ends_at IS NOT NULL
  )
  SELECT slot_start,slot_end,
    capacity-(SELECT count(*)::int FROM appointment a
      WHERE a.status IN ('pending','confirmed','arrived')
      AND tstzrange(a.starts_at,a.ends_at,'[)')&&tstzrange(slots.slot_start,slots.slot_end,'[)')) AS remaining
  FROM slots ORDER BY slot_start`,[date,jalaliDate]);
  return res.status(200).json({ok:true,date,jalaliDate:jalaliDate||null,slots:result.rows.filter((x:any)=>Number(x.remaining)>0),requestId});
 }catch(error){console.error('availability_failed',{requestId,error});return res.status(500).json({ok:false,code:'AVAILABILITY_FAILED',requestId});}
}