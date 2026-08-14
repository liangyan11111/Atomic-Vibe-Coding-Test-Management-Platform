/**
 * GET /api/vibe/sessions - 获取会话列表
 * POST /api/vibe/sessions - 创建新会话
 */
import { listSessions, createSession } from '@/storage/database/vibe-session.repository';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const sessions = await listSessions();
    return Response.json({ success: true, data: sessions });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, modulePath, modelUsed } = body;

    if (!title || typeof title !== 'string') {
      return Response.json({ error: '标题不能为空' }, { status: 400 });
    }

    const session = await createSession({ title, modulePath, modelUsed });
    return Response.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}
