import Database from 'better-sqlite3';
import { join } from 'path';
import type { User } from './types';

interface RawUser {
  id: string;
  username: string;
  password: string;
  avatar: string | null;
  progress: string | null;
}

// 使用绝对路径
const dbPath = join(process.cwd(), 'data/users.db');
console.log('Database path:', dbPath); // 调试路径
const db = new Database(dbPath);

// 创建用户表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    avatar TEXT,
    progress TEXT
  )
`);

function parseProgress(progress: string | null): { taskId: number; completed: boolean }[] {
  if (!progress) return [];
  try {
    const parsed = JSON.parse(progress);
    if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && 'taskId' in item && 'completed' in item)) {
      return parsed as { taskId: number; completed: boolean }[];
    }
    return [];
  } catch (error) {
    console.error('Failed to parse progress:', error);
    return [];
  }
}

// 初始化默认用户
function initDefaultUser() {
  const defaultUsername = 'admin';
  const defaultPassword = 'admin123'; // 在生产环境中应加密密码
  const existingUser = getUserByUsername(defaultUsername);
  
  if (!existingUser) {
    console.log('No users found, creating default admin user...');
    const defaultUser: User = {
      id: crypto.randomUUID(),
      username: defaultUsername,
      password: defaultPassword,
      avatar: '/favicon.png',
      progress: [],
    };
    createUser(defaultUser);
    console.log(`Default user created: username=${defaultUsername}, password=${defaultPassword}`);
  } else {
    console.log('Default user already exists, skipping initialization.');
  }
}

export function getUserByUsername(username: string): User | null {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  const user = stmt.get(username) as RawUser | undefined;
  if (user) {
    return {
      id: user.id,
      username: user.username,
      password: user.password,
      avatar: user.avatar ?? '/favicon.png',
      progress: parseProgress(user.progress),
    };
  }
  return null;
}

export function getUsers(): User[] {
  const stmt = db.prepare('SELECT * FROM users');
  const users = stmt.all() as RawUser[];
  return users.map((u) => ({
    id: u.id,
    username: u.username,
    password: u.password,
    avatar: u.avatar ?? '/favicon.png',
    progress: parseProgress(u.progress),
  }));
}

export function createUser(user: User) {
  const stmt = db.prepare('INSERT INTO users (id, username, password, avatar, progress) VALUES (?, ?, ?, ?, ?)');
  stmt.run(user.id, user.username, user.password, user.avatar, JSON.stringify(user.progress));
}

export function updateUser(user: User) {
  const stmt = db.prepare('UPDATE users SET username = ?, password = ?, avatar = ?, progress = ? WHERE id = ?');
  stmt.run(user.username, user.password, user.avatar, JSON.stringify(user.progress), user.id);
}

// 在模块加载时调用初始化函数
initDefaultUser();