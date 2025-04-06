export interface User {
  id: string;
  username: string;
  password: string;
  avatar: string; // 改为必填字段
  progress: { taskId: number; completed: boolean }[]; // 改为必填字段
}

export interface Task {
  id: number;
  title: string;
  description: string;
  hint?: string;
  expectedOutput: string;
  outputPattern?: string;
  input?: string | null;
  inputExample?: string | null;
  outputExample?: string;
  inputType?: 'string' | 'number' | 'number[]';
  outputType?: 'string' | 'number';
  tutorial?: string;
  knowledgePoint: string;
}