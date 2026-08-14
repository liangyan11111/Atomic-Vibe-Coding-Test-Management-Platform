/**
 * GET /api/vibe/versions?sessionId=xxx - 获取版本列表
 * POST /api/vibe/versions - 创建版本
 */
import { listVersions, createVersion } from '@/storage/database/vibe-version.repository';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId) {
      return Response.json({ error: 'sessionId 参数必填' }, { status: 400 });
    }
    const versions = await listVersions(sessionId);
    return Response.json({ success: true, data: versions });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, version, description, parentVersionId, fileChanges } = body;

    if (!sessionId || !version || !description) {
      return Response.json(
        { error: 'sessionId, version, description 不能为空' },
        { status: 400 }
      );
    }

    const newVersion = await createVersion({
      sessionId,
      version,
      description,
      parentVersionId,
      fileChanges: fileChanges || [],
    });
    return Response.json({ success: true, data: newVersion }, { status: 201 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}
