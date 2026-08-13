/**
 * 质量门禁
 * 职责：确保 AI 生成的代码满足质量标准
 */

/** 代码质量指标 */
export interface QualityMetrics {
  maxFunctionLines: number;
  maxFileLines: number;
  maxComplexity: number;
  requireErrorBoundary: boolean;
  requireTraceId: boolean;
}

/** 默认质量门禁配置 */
export const DEFAULT_QUALITY_GATES: QualityMetrics = {
  maxFunctionLines: 50,
  maxFileLines: 300,
  maxComplexity: 10,
  requireErrorBoundary: true,
  requireTraceId: true,
};

/** 门禁检查结果 */
export interface GateCheckResult {
  passed: boolean;
  violations: Array<{
    rule: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
}

/**
 * 检查文件行数是否超限
 */
export function checkFileLineCount(content: string, maxLines: number): { passed: boolean; lineCount: number } {
  const lineCount = content.split('\n').length;
  return { passed: lineCount <= maxLines, lineCount };
}

/**
 * 检查是否包含硬编码密钥
 */
export function checkHardcodedSecrets(content: string): { passed: boolean; findings: string[] } {
  const patterns = [
    /(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    /(?:AKIA|sk-|ghp_)[A-Za-z0-9]{20,}/g,
  ];

  const findings: string[] = [];
  patterns.forEach((pattern) => {
    const matches = content.match(pattern);
    if (matches) {
      findings.push(...matches);
    }
  });

  return { passed: findings.length === 0, findings };
}

/**
 * 检查是否包含 console.log（生产环境禁止）
 * 注意：仅检查 console.log，不检查 debug/error/warn（基础设施层允许使用）
 */
export function checkConsoleInProduction(content: string): { passed: boolean; count: number } {
  const matches = content.match(/console\.log\s*\(/g);
  return { passed: !matches, count: matches?.length || 0 };
}

/**
 * 执行完整的质量门禁检查
 */
export function runQualityGates(content: string, gates: QualityMetrics = DEFAULT_QUALITY_GATES): GateCheckResult {
  const violations: GateCheckResult['violations'] = [];

  // 文件行数检查
  const lineCheck = checkFileLineCount(content, gates.maxFileLines);
  if (!lineCheck.passed) {
    violations.push({
      rule: 'max-file-lines',
      message: `File has ${lineCheck.lineCount} lines (max: ${gates.maxFileLines})`,
      severity: 'warning',
    });
  }

  // 硬编码密钥检查
  const secretCheck = checkHardcodedSecrets(content);
  if (!secretCheck.passed) {
    violations.push({
      rule: 'no-hardcoded-secrets',
      message: `Found ${secretCheck.findings.length} potential hardcoded secrets`,
      severity: 'error',
    });
  }

  return {
    passed: violations.filter((v) => v.severity === 'error').length === 0,
    violations,
  };
}
