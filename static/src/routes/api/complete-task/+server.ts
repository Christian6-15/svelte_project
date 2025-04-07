import { json } from '@sveltejs/kit';
import { authenticateUser } from '$lib/utils';
import { updateUser } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const user = await authenticateUser(request);
    const { taskId } = await request.json();
    const currentProgress = user.progress ?? [];
    const updatedProgress = currentProgress.some((p) => p.taskId === taskId)
      ? currentProgress
      : [...currentProgress, { taskId, completed: true }];
    updateUser({ ...user, progress: updatedProgress });
    return json({ progress: updatedProgress }, { status: 200 });
  } catch (error: any) {
    return json({ error: error.message }, { status: error.cause?.status || 500 });
  }
};