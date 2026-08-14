/**
 * Vibe 会话仓储 — Supabase 实现
 * 负责 vibe_sessions + vibe_messages 的 CRUD
 */
import { getSupabaseClient } from '@/storage/database/supabase-client';

/** 会话行类型（snake_case，与数据库一致） */
export interface VibeSessionRow {
  id: string;
  title: string;
  status: string;
  module_path: string | null;
  model_used: string | null;
  created_at: string;
  updated_at: string;
}

/** 消息行类型 */
export interface VibeMessageRow {
  id: string;
  session_id: string;
  role: string;
  content: string;
  attachments: unknown | null;
  created_at: string;
}

/** 创建会话参数 */
export interface CreateSessionParams {
  title: string;
  modulePath?: string;
  modelUsed?: string;
}

/**
 * 获取所有会话列表
 */
export async function listSessions(limit = 50): Promise<VibeSessionRow[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('vibe_sessions')
    .select('id, title, status, module_path, model_used, created_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(`查询会话列表失败: ${error.message}`);
  return (data as VibeSessionRow[]) || [];
}

/**
 * 获取单个会话详情（含消息）
 */
export async function getSessionWithMessages(sessionId: string): Promise<{
  session: VibeSessionRow;
  messages: VibeMessageRow[];
} | null> {
  const client = getSupabaseClient();

  const { data: sessionData, error: sessionError } = await client
    .from('vibe_sessions')
    .select('id, title, status, module_path, model_used, created_at, updated_at')
    .eq('id', sessionId)
    .maybeSingle();
  if (sessionError) throw new Error(`查询会话失败: ${sessionError.message}`);
  if (!sessionData) return null;

  const { data: messagesData, error: messagesError } = await client
    .from('vibe_messages')
    .select('id, session_id, role, content, attachments, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (messagesError) throw new Error(`查询消息失败: ${messagesError.message}`);

  return {
    session: sessionData as VibeSessionRow,
    messages: (messagesData as VibeMessageRow[]) || [],
  };
}

/**
 * 创建新会话
 */
export async function createSession(params: CreateSessionParams): Promise<VibeSessionRow> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('vibe_sessions')
    .insert({
      title: params.title,
      module_path: params.modulePath || null,
      model_used: params.modelUsed || null,
      status: 'active',
    })
    .select('id, title, status, module_path, model_used, created_at, updated_at')
    .single();
  if (error) throw new Error(`创建会话失败: ${error.message}`);
  return data as VibeSessionRow;
}

/**
 * 更新会话标题/状态
 */
export async function updateSession(
  sessionId: string,
  updates: { title?: string; status?: string }
): Promise<VibeSessionRow | null> {
  const client = getSupabaseClient();
  const updateData: Record<string, string> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.status !== undefined) updateData.status = updates.status;

  const { data, error } = await client
    .from('vibe_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .select('id, title, status, module_path, model_used, created_at, updated_at')
    .maybeSingle();
  if (error) throw new Error(`更新会话失败: ${error.message}`);
  return (data as VibeSessionRow) || null;
}

/**
 * 删除会话（级联删除消息）
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const client = getSupabaseClient();
  const { error } = await client.from('vibe_sessions').delete().eq('id', sessionId);
  if (error) throw new Error(`删除会话失败: ${error.message}`);
}

/**
 * 添加消息到会话
 */
export async function addMessage(
  sessionId: string,
  role: string,
  content: string,
  attachments?: unknown
): Promise<VibeMessageRow> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('vibe_messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      attachments: attachments || null,
    })
    .select('id, session_id, role, content, attachments, created_at')
    .single();
  if (error) throw new Error(`添加消息失败: ${error.message}`);
  return data as VibeMessageRow;
}

/**
 * 批量添加消息
 */
export async function addMessages(
  sessionId: string,
  messages: Array<{ role: string; content: string; attachments?: unknown }>
): Promise<void> {
  if (messages.length === 0) return;
  const client = getSupabaseClient();
  const rows = messages.map((m) => ({
    session_id: sessionId,
    role: m.role,
    content: m.content,
    attachments: m.attachments || null,
  }));
  const { error } = await client.from('vibe_messages').insert(rows);
  if (error) throw new Error(`批量添加消息失败: ${error.message}`);
}
