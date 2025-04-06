import { json } from '@sveltejs/kit';
import { getUserByUsername } from '$lib/db';
import cookie from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();
  const user = getUserByUsername(username);
  if (!user || user.password !== password) {
    return json({ error: '用户名或密码错误' }, { status: 401 });
  }
  const sessionCookie = cookie.serialize('session', user.username, {
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return json({ message: '登录成功' }, {
    status: 200,
    headers: { 'Set-Cookie': sessionCookie },
  });
};