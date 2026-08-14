/**
 * POST /api/vibe/sessions/[sessionId]/messages - 添加消息
 */
import { addMessage, addMessages } from '@/storage/database/vibe-session.repository';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await request.json();

    // 支持单条或批量
    if (Array.isArray(body.messages)) {
      await addMessages(
        sessionId,
        body.messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        }))
      );
      return Response.json({ success: true });
    }

    const { role, content } = body;
    if (!role || !content) {
      return Response.json({ error: 'role 和 content 不能为空' }, { status: 400 });
    }

    const message = await addMessage(sessionId, role, content);
    return Response.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}
