// src/lib/utils.ts
import { json } from '@sveltejs/kit';
import { getUserByUsername } from '$lib/db';
import cookie from 'cookie';
import type { User } from '$lib/types';

export async function authenticateUser(request: Request): Promise<User> {
  const cookies = request.headers.get('cookie');
  if (!cookies) throw new Error('未登录', { cause: { status: 401 } });
  const parsedCookies = cookie.parse(cookies);
  const username = parsedCookies.session;
  if (!username) throw new Error('未登录', { cause: { status: 401 } });
  const user = getUserByUsername(username);
  if (!user) throw new Error('用户不存在', { cause: { status: 404 } });
  return user;
}