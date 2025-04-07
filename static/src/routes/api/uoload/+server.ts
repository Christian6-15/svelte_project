import { json } from '@sveltejs/kit';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('avatar') as File;
  if (!file) return json({ error: '未提供文件' }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return json({ error: '文件过大，最大支持 5MB' }, { status: 400 });
  if (!file.type.startsWith('image/')) return json({ error: '只支持图片文件' }, { status: 400 });
  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const filePath = join('static/uploads', fileName);
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return json({ path: `/uploads/${fileName}` }, { status: 200 });
};