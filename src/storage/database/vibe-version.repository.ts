/**
 * Vibe 版本仓储 — Supabase 实现
 * 负责 vibe_versions + vibe_file_changes 的 CRUD
 */
import { getSupabaseClient } from '@/storage/database/supabase-client';

/** 版本行类型 */
export interface VibeVersionRow {
  id: string;
  session_id: string;
  version: string;
  description: string;
  status: string;
  parent_version_id: string | null;
  created_at: string;
}

/** 文件变更行类型 */
export interface VibeFileChangeRow {
  id: string;
  version_id: string;
  file_path: string;
  action: string;
  before_content: string | null;
  after_content: string;
  diff: string | null;
  language: string | null;
  created_at: string;
}

/** 创建版本参数 */
export interface CreateVersionParams {
  sessionId: string;
  version: string;
  description: string;
  parentVersionId?: string;
  fileChanges: Array<{
    filePath: string;
    action: string;
    beforeContent?: string;
    afterContent: string;
    diff?: string;
    language?: string;
  }>;
}

/**
 * 获取指定会话的版本列表
 */
export async function listVersions(sessionId: string): Promise<VibeVersionRow[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('vibe_versions')
    .select('id, session_id, version, description, status, parent_version_id, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`查询版本列表失败: ${error.message}`);
  return (data as VibeVersionRow[]) || [];
}

/**
 * 获取版本详情（含文件变更）
 */
export async function getVersionWithChanges(versionId: string): Promise<{
  version: VibeVersionRow;
  fileChanges: VibeFileChangeRow[];
} | null> {
  const client = getSupabaseClient();

  const { data: versionData, error: versionError } = await client
    .from('vibe_versions')
    .select('id, session_id, version, description, status, parent_version_id, created_at')
    .eq('id', versionId)
    .maybeSingle();
  if (versionError) throw new Error(`查询版本失败: ${versionError.message}`);
  if (!versionData) return null;

  const { data: changesData, error: changesError } = await client
    .from('vibe_file_changes')
    .select('id, version_id, file_path, action, before_content, after_content, diff, language, created_at')
    .eq('version_id', versionId)
    .order('file_path');
  if (changesError) throw new Error(`查询文件变更失败: ${changesError.message}`);

  return {
    version: versionData as VibeVersionRow,
    fileChanges: (changesData as VibeFileChangeRow[]) || [],
  };
}

/**
 * 创建版本（含文件变更）
 */
export async function createVersion(params: CreateVersionParams): Promise<VibeVersionRow> {
  const client = getSupabaseClient();

  // 1. 创建版本记录
  const { data: versionData, error: versionError } = await client
    .from('vibe_versions')
    .insert({
      session_id: params.sessionId,
      version: params.version,
      description: params.description,
      parent_version_id: params.parentVersionId || null,
      status: 'draft',
    })
    .select('id, session_id, version, description, status, parent_version_id, created_at')
    .single();
  if (versionError) throw new Error(`创建版本失败: ${versionError.message}`);
  const newVersion = versionData as VibeVersionRow;

  // 2. 批量创建文件变更记录
  if (params.fileChanges.length > 0) {
    const changeRows = params.fileChanges.map((fc) => ({
      version_id: newVersion.id,
      file_path: fc.filePath,
      action: fc.action,
      before_content: fc.beforeContent || null,
      after_content: fc.afterContent,
      diff: fc.diff || null,
      language: fc.language || null,
    }));
    const { error: changesError } = await client.from('vibe_file_changes').insert(changeRows);
    if (changesError) throw new Error(`创建文件变更失败: ${changesError.message}`);
  }

  return newVersion;
}

/**
 * 更新版本状态
 */
export async function updateVersionStatus(
  versionId: string,
  status: string
): Promise<VibeVersionRow | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('vibe_versions')
    .update({ status })
    .eq('id', versionId)
    .select('id, session_id, version, description, status, parent_version_id, created_at')
    .maybeSingle();
  if (error) throw new Error(`更新版本状态失败: ${error.message}`);
  return (data as VibeVersionRow) || null;
}

/**
 * 删除版本（级联删除文件变更）
 */
export async function deleteVersion(versionId: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('vibe_versions').delete().eq('id', versionId);
  if (error) throw new Error(`删除版本失败: ${error.message}`);
}
