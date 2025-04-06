// src/routes/api/user/update/+server.ts
import { json } from '@sveltejs/kit';
import { authenticateUser } from '$lib/utils';
import { updateUser } from '$lib/db';
import cookie from 'cookie';
import { unlink } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const user = await authenticateUser(request);
    const { newUsername, oldPassword, password, avatar } = await request.json();
    const updatedUser = { ...user };

    // 如果提供了新密码，验证旧密码
    if (password) {
      if (!oldPassword) {
        return json({ error: '请输入旧密码' }, { status: 400 });
      }
      if (oldPassword !== user.password) {
        return json({ error: '旧密码错误' }, { status: 401 });
      }
    }

    // 如果提供了新头像，删除旧头像文件
    if (avatar && user.avatar !== avatar && user.avatar !== '/favicon.png') {
      const oldFilePath = join('static', user.avatar.replace(/^\/uploads\//, 'uploads/'));
      await unlink(oldFilePath).catch((err) => console.error('删除旧头像失败:', err));
    }

    // 更新用户信息
    if (newUsername) updatedUser.username = newUsername;
    if (password) updatedUser.password = password;
    if (avatar) updatedUser.avatar = avatar;

    updateUser(updatedUser);

    // 如果用户名更改，更新 session cookie
    if (newUsername) {
      const sessionCookie = cookie.serialize('session', newUsername, {
        maxAge: 60 * 60 * 24,
        path: '/',
      });
      return json({ message: '用户信息已更新' }, {
        status: 200,
        headers: { 'Set-Cookie': sessionCookie },
      });
    }

    return json({ message: '用户信息已更新' }, { status: 200 });
  } catch (error: any) {
    return json({ error: error.message }, { status: error.cause?.status || 500 });
  }
};