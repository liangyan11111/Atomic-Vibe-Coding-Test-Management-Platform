/**
 * 值对象 - 测试执行结果
 */

export class ExecutionResult {
  private readonly value: 'passed' | 'failed' | 'blocked' | 'skipped';

  private static readonly LABELS: Record<string, string> = {
    passed: '通过', failed: '失败', blocked: '阻塞', skipped: '跳过',
  };

  constructor(value: 'passed' | 'failed' | 'blocked' | 'skipped') {
    this.value = value;
  }

  getValue(): 'passed' | 'failed' | 'blocked' | 'skipped' {
    return this.value;
  }

  getLabel(): string {
    return ExecutionResult.LABELS[this.value];
  }

  isPassed(): boolean {
    return this.value === 'passed';
  }

  isFailed(): boolean {
    return this.value === 'failed';
  }

  equals(other: ExecutionResult): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.getLabel();
  }
}
