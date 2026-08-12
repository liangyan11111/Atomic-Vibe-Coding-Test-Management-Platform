/**
 * 值对象 - 优先级
 * Value Object: 无唯一标识，不可变，通过属性值相等判断
 */

export class Priority {
  private readonly value: 'P0' | 'P1' | 'P2' | 'P3';

  private static readonly WEIGHTS: Record<string, number> = {
    P0: 4, P1: 3, P2: 2, P3: 1,
  };

  private static readonly LABELS: Record<string, string> = {
    P0: '紧急', P1: '高', P2: '中', P3: '低',
  };

  constructor(value: 'P0' | 'P1' | 'P2' | 'P3') {
    this.value = value;
  }

  getValue(): 'P0' | 'P1' | 'P2' | 'P3' {
    return this.value;
  }

  getWeight(): number {
    return Priority.WEIGHTS[this.value];
  }

  getLabel(): string {
    return Priority.LABELS[this.value];
  }

  isHigherThan(other: Priority): boolean {
    return this.getWeight() > other.getWeight();
  }

  equals(other: Priority): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return `${this.value} (${this.getLabel()})`;
  }
}
