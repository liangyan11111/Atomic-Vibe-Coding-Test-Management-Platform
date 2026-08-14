/**
 * GET /api/vibe/sessions/[sessionId] - 获取会话详情（含消息）
 * PATCH /api/vibe/sessions/[sessionId] - 更新会话
 * DELETE /api/vibe/sessions/[sessionId] - 删除会话
 */
import {
  getSessionWithMessages,
  updateSession,
  deleteSession,
} from '@/storage/database/vibe-session.repository';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const result = await getSessionWithMessages(sessionId);
    if (!result) {
      return Response.json({ error: '会话不存在' }, { status: 404 });
    }
    return Response.json({ success: true, data: result });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();
    const { title, status } = body;

    const updated = await updateSession(sessionId, { title, status });
    if (!updated) {
      return Response.json({ error: '会话不存在' }, { status: 404 });
    }
    return Response.json({ success: true, data: updated });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    await deleteSession(sessionId);
    return Response.json({ success: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}
