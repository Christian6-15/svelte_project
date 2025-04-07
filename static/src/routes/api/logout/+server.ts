import { json } from '@sveltejs/kit';
import cookie from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
  const sessionCookie = cookie.serialize('session', '', {
    maxAge: 0,
    path: '/',
  });
  return json({ message: '登出成功' }, {
    status: 200,
    headers: { 'Set-Cookie': sessionCookie },
  });
};