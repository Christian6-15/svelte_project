// src/lib/auth.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { User } from './types';

// 定义 Progress 条目的类型
export interface Progress {
  taskId: number;
  completed: boolean;
}

export const user = writable<User | null>(null);
export const progress = writable<Progress[]>([]);

export async function initUser() {
  if (!browser) return;
  try {
    const response = await fetch('/api/user', {
      credentials: 'include',
    });
    if (response.ok) {
      const userData = await response.json();
      if (userData && !userData.error) {
        user.set(userData);
        progress.set(userData.progress || []);
      } else {
        user.set(null);
        progress.set([]);
      }
    } else {
      user.set(null);
      progress.set([]);
    }
  } catch (error) {
    console.error('初始化用户失败:', error);
    user.set(null);
    progress.set([]);
  }
}

export async function completeTask(taskId: number) {
  if (!browser) return;
  try {
    const response = await fetch('/api/complete-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
      credentials: 'include',
    });
    if (response.ok) {
      const { progress: updatedProgress } = await response.json();
      progress.set(updatedProgress);
    } else {
      console.error('完成任务失败:', await response.json());
    }
  } catch (error) {
    console.error('完成任务失败:', error);
  }
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    if (response.ok) {
      const userData = await getUserInfo();
      if (userData) {
        user.set(userData);
        progress.set(userData.progress || []);
        console.log('Loaded progress on login:', userData.progress || []);
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    console.error('登录失败:', error);
    return false;
  }
}

export async function register(username: string, password: string): Promise<boolean> {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    if (response.ok) {
      const userData = await getUserInfo();
      if (userData) {
        user.set(userData);
        progress.set(userData.progress || []);
        console.log('Initialized progress on register:', userData.progress || []);
        return true;
      }
      return false;
    }
    return false;
  } catch (error) {
    console.error('注册失败:', error);
    return false;
  }
}

export async function logout(): Promise<void> {
  const userData = await getUserInfo();
  if (userData) {
    console.log('Saved progress on logout:', userData.progress);
  }
  await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });
  user.set(null);
  progress.set([]);
}

export async function getUserInfo(): Promise<User | null> {
  if (!browser) return null;
  try {
    const response = await fetch('/api/user', {
      credentials: 'include',
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
}