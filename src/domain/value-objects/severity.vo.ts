/**
 * 值对象 - 缺陷严重程度
 */

export class Severity {
  private readonly value: 'critical' | 'major' | 'minor' | 'trivial';

  private static readonly WEIGHTS: Record<string, number> = {
    critical: 4, major: 3, minor: 2, trivial: 1,
  };

  private static readonly LABELS: Record<string, string> = {
    critical: '致命', major: '严重', minor: '一般', trivial: '轻微',
  };

  constructor(value: 'critical' | 'major' | 'minor' | 'trivial') {
    this.value = value;
  }

  getValue(): 'critical' | 'major' | 'minor' | 'trivial' {
    return this.value;
  }

  getWeight(): number {
    return Severity.WEIGHTS[this.value];
  }

  getLabel(): string {
    return Severity.LABELS[this.value];
  }

  isCritical(): boolean {
    return this.value === 'critical';
  }

  equals(other: Severity): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return `${this.value} (${this.getLabel()})`;
  }
}
