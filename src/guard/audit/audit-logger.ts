/**
 * 审计日志模块
 * 记录所有关键操作的审计链路
 */

export interface AuditLogEntry {
  timestamp: string;
  traceId: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: Record<string, unknown>;
  status: 'success' | 'failure';
  errorMessage?: string;
}

// 内存审计日志存储（生产环境应替换为持久化存储）
const auditLogs: AuditLogEntry[] = [];

export function createAuditLog(params: {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: Record<string, unknown>;
  traceId?: string;
}): AuditLogEntry {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    traceId: params.traceId ?? `trace-${Date.now()}`,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    userId: params.userId,
    details: params.details,
    status: 'success',
  };
  auditLogs.push(entry);
  return entry;
}

export function getAuditLogs(filter?: { entityType?: string; userId?: string; action?: string }): AuditLogEntry[] {
  let result = [...auditLogs];
  if (filter?.entityType) result = result.filter(l => l.entityType === filter.entityType);
  if (filter?.userId) result = result.filter(l => l.userId === filter.userId);
  if (filter?.action) result = result.filter(l => l.action === filter.action);
  return result;
}
