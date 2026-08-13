import { describe, it, expect } from 'vitest';
import { TestCaseEntity } from '@/domain/entities/test-case.entity';
import type { TestCase, TestStep } from '@/lib/types';

const makeTestCase = (overrides: Partial<TestCase> = {}): TestCase => ({
  id: 'TC-001',
  projectId: 'P1',
  title: '登录功能测试',
  description: '测试登录功能',
  module: '用户模块',
  priority: 'P0',
  type: 'functional',
  status: 'active',
  precondition: '用户已注册',
  steps: [{ order: 1, action: '输入用户名密码', expected: '登录成功' }] as TestStep[],
  expectedResult: '登录成功',
  tags: ['登录'],
  createdBy: 'tester1',
  assignedTo: 'tester1',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
  lastExecutedAt: null,
  passRate: 100,
  executionCount: 5,
  ...overrides,
});

describe('TestCaseEntity', () => {
  it('should create entity from DTO', () => {
    const dto = makeTestCase();
    const entity = new TestCaseEntity(dto);
    expect(entity.id).toBe('TC-001');
    expect(entity.title).toBe('登录功能测试');
    expect(entity.priority).toBe('P0');
  });

  it('should return correct priority weight', () => {
    const entity = new TestCaseEntity(makeTestCase({ priority: 'P0' }));
    expect(entity.getPriorityWeight()).toBe(4);

    const entity2 = new TestCaseEntity(makeTestCase({ priority: 'P3' }));
    expect(entity2.getPriorityWeight()).toBe(1);
  });

  it('should identify if needs review', () => {
    const entity = new TestCaseEntity(makeTestCase({ passRate: 70, executionCount: 5 }));
    expect(entity.needsReview()).toBe(true);

    const entity2 = new TestCaseEntity(makeTestCase({ passRate: 95, executionCount: 5 }));
    expect(entity2.needsReview()).toBe(false);
  });

  it('should check if blocking', () => {
    const entity = new TestCaseEntity(makeTestCase({ priority: 'P0', status: 'active' }));
    expect(entity.isBlocking()).toBe(true);

    const entity2 = new TestCaseEntity(makeTestCase({ priority: 'P3', status: 'draft' }));
    expect(entity2.isBlocking()).toBe(false);
  });

  it('should convert to DTO', () => {
    const dto = makeTestCase();
    const entity = new TestCaseEntity(dto);
    const result = entity.toDTO();
    expect(result.id).toBe('TC-001');
    expect(result.title).toBe('登录功能测试');
  });
});
