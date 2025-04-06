import { json } from '@sveltejs/kit';
import { authenticateUser } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
  try {
    const user = await authenticateUser(request);
    return json({
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      progress: user.progress ?? [],
    });
  } catch (error: any) {
    return json({ error: error.message }, { status: error.cause?.status || 500 });
  }
};