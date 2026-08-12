export { createAuditLog, getAuditLogs } from './audit-logger';
export type { AuditLogEntry } from './audit-logger';

/**
 * 生成 Trace ID
 */
export function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * 带 Trace 上下文执行函数
 */
export async function withTrace<T>(componentName: string, fn: () => Promise<T>): Promise<T> {
  return fn();
}
