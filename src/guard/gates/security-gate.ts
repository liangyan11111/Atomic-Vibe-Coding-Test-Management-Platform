/**
 * 安全门禁
 * 职责：确保代码符合安全规范
 */

/** AI 禁止操作清单 */
export const AI_FORBIDDEN_OPERATIONS = [
  'direct-db-call',
  'hardcoded-secrets',
  'skip-auth',
  'sql-injection',
  'bypass-rate-limit',
  'unauthorized-external-service',
  'pii-in-logs',
  'modify-domain-layer',
] as const;

export type ForbiddenOperation = typeof AI_FORBIDDEN_OPERATIONS[number];

/** 安全检查结果 */
export interface SecurityCheckResult {
  passed: boolean;
  blockedOperations: Array<{
    operation: ForbiddenOperation;
    location: string;
    detail: string;
  }>;
}

/**
 * 检查是否直接操作数据库
 */
export function checkDirectDbCall(content: string): boolean {
  const patterns = [
    /(?:sqlite3|pg|mysql)\.(?:query|execute|run)\s*\(/i,
    /(?:knex|sequelize|prisma)\.\$queryRaw/i,
    /SELECT\s+.*\s+FROM\s+/i,
    /INSERT\s+INTO\s+/i,
    /UPDATE\s+.*\s+SET\s+/i,
    /DELETE\s+FROM\s+/i,
  ];
  return patterns.some((p) => p.test(content));
}

/**
 * 检查是否包含 SQL 拼接
 */
export function checkSqlInjection(content: string): boolean {
  const patterns = [
    /`\s*SELECT\s+.*\$\{/i,
    /`\s*INSERT\s+.*\$\{/i,
    /`\s*UPDATE\s+.*\$\{/i,
    /`\s*DELETE\s+.*\$\{/i,
    /['"]\s*\+\s*(?:req|input|param)/i,
  ];
  return patterns.some((p) => p.test(content));
}

/**
 * 检查是否在日志中包含 PII
 */
export function checkPiiInLogs(content: string): boolean {
  const patterns = [
    /console\.log\(.*(?:password|secret|token|ssn|credit.?card)/i,
    /logger\.(?:info|debug|warn)\(.*(?:email|phone|address)/i,
  ];
  return patterns.some((p) => p.test(content));
}

/**
 * 执行完整的安全检查
 */
export function runSecurityGates(content: string): SecurityCheckResult {
  const blocked: SecurityCheckResult['blockedOperations'] = [];

  if (checkDirectDbCall(content)) {
    blocked.push({
      operation: 'direct-db-call',
      location: 'source',
      detail: 'Direct database call detected. Use Repository interface instead.',
    });
  }

  if (checkSqlInjection(content)) {
    blocked.push({
      operation: 'sql-injection',
      location: 'source',
      detail: 'SQL injection risk detected. Use parameterized queries.',
    });
  }

  if (checkPiiInLogs(content)) {
    blocked.push({
      operation: 'pii-in-logs',
      location: 'source',
      detail: 'PII detected in logs. Remove sensitive data from logging.',
    });
  }

  return { passed: blocked.length === 0, blockedOperations: blocked };
}
