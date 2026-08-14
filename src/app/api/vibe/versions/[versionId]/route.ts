/**
 * GET /api/vibe/versions/[versionId] - 获取版本详情（含文件变更）
 * PATCH /api/vibe/versions/[versionId] - 更新版本状态
 * DELETE /api/vibe/versions/[versionId] - 删除版本
 */
import {
  getVersionWithChanges,
  updateVersionStatus,
  deleteVersion,
} from '@/storage/database/vibe-version.repository';

export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ versionId: string }> }
) {
  try {
    const { versionId } = await params;
    const result = await getVersionWithChanges(versionId);
    if (!result) {
      return Response.json({ error: '版本不存在' }, { status: 404 });
    }
    return Response.json({ success: true, data: result });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ versionId: string }> }
) {
  try {
    const { versionId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return Response.json({ error: 'status 不能为空' }, { status: 400 });
    }

    const updated = await updateVersionStatus(versionId, status);
    if (!updated) {
      return Response.json({ error: '版本不存在' }, { status: 404 });
    }
    return Response.json({ success: true, data: updated });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ versionId: string }> }
) {
  try {
    const { versionId } = await params;
    await deleteVersion(versionId);
    return Response.json({ success: true });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: errMsg }, { status: 500 });
  }
}
