import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { withTransaction } from '../../server/db.js';
import { clientFingerprint, createSession, setSessionCookie } from '../../server/security.js';

const Input = z.object({ mobile:z.string().regex(/^09\d{9}$/), code:z.string().regex(/^\d{6}$/), purpose:z.enum(['login','booking','admin']).default('login') });
const hash = (value:string) => createHash('sha256').update(value).digest('hex');

export default async function handler(req:VercelRequest,res:VercelResponse){
  const requestId=String(req.headers['x-request-id']||crypto.randomUUID());
  res.setHeader('Cache-Control','no-store'); res.setHeader('X-Request-Id',requestId);
  if(req.method!=='POST') return res.status(405).json({ok:false,code:'METHOD_NOT_ALLOWED',requestId});
  if(!process.env.DATABASE_URL || !process.env.AUTH_SECRET) return res.status(503).json({ok:false,code:'AUTH_NOT_CONFIGURED',requestId});
  const parsed=Input.safeParse(req.body);
  if(!parsed.success) return res.status(422).json({ok:false,code:'VALIDATION_ERROR',issues:parsed.error.issues,requestId});
  try{
    const result=await withTransaction(async client=>{
      const challenge=await client.query(
        `SELECT id,code_hash,attempts FROM otp_challenge
         WHERE destination=$1 AND purpose=$2 AND consumed_at IS NULL AND expires_at>now()
         ORDER BY created_at DESC LIMIT 1 FOR UPDATE`,
        [parsed.data.mobile,parsed.data.purpose]
      );
      if(!challenge.rowCount) throw new Error('OTP_INVALID_OR_EXPIRED');
      const expected=hash(`${parsed.data.code}:${process.env.AUTH_SECRET}`);
      if(challenge.rows[0].code_hash!==expected){
        await client.query('UPDATE otp_challenge SET attempts=attempts+1 WHERE id=$1',[challenge.rows[0].id]);
        throw new Error('OTP_INVALID_OR_EXPIRED');
      }
      await client.query('UPDATE otp_challenge SET consumed_at=now() WHERE id=$1',[challenge.rows[0].id]);
      const user=await client.query(
        `INSERT INTO app_user(mobile,display_name) VALUES($1,NULL)
         ON CONFLICT(mobile) DO UPDATE SET updated_at=now() RETURNING id`,
        [parsed.data.mobile]
      );
      const roles=await client.query<{code:string}>(
        `SELECT r.code FROM user_role ur JOIN role r ON r.id=ur.role_id WHERE ur.user_id=$1`,
        [user.rows[0].id]
      );
      return {userId:user.rows[0].id,roles:roles.rows.map(r=>r.code)};
    });
    const session=await createSession(result.userId,result.roles,hash(clientFingerprint(req)),String(req.headers['user-agent']||''));
    setSessionCookie(res,session.token);
    return res.status(200).json({ok:true,user:{id:result.userId,roles:result.roles},requestId});
  }catch(error){
    const code=error instanceof Error?error.message:'AUTH_FAILED';
    return res.status(code==='OTP_INVALID_OR_EXPIRED'?401:500).json({ok:false,code,requestId});
  }
}
