import { json } from '@sveltejs/kit';
import { getUserByUsername, createUser } from '$lib/db';
import cookie from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';
import type { User } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();
  if (getUserByUsername(username)) {
    return json({ error: '用户名已存在' }, { status: 400 });
  }
  const newUser: User = {
    id: crypto.randomUUID(),
    username,
    password,
    avatar: '/favicon.png',
    progress: [],
  };
  createUser(newUser);
  const sessionCookie = cookie.serialize('session', newUser.username, {
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return json({ message: '注册成功' }, {
    status: 201,
    headers: { 'Set-Cookie': sessionCookie },
  });
};