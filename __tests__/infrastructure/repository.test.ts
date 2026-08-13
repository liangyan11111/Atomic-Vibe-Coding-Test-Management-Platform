import { describe, it, expect } from 'vitest';
import { getTestCaseRepository, getDefectRepository, getTestPlanRepository } from '../../src/infrastructure/repositories';
import type { TestCase, Defect, TestPlan } from '../../src/lib/types';

function makeTestCase(overrides: Partial<TestCase> = {}): Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    projectId: 'P-001',
    title: '登录测试',
    description: '测试登录功能',
    module: '用户模块',
    priority: 'P0',
    type: 'functional',
    status: 'draft',
    precondition: '用户已注册',
    steps: [{ order: 1, action: '输入用户名密码', expected: '登录成功' }],
    expectedResult: '登录成功',
    tags: ['登录'],
    createdBy: 'tester1',
    assignedTo: 'tester1',
    ...overrides,
  } as Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>;
}

function makeDefect(overrides: Partial<Defect> = {}): Omit<Defect, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    projectId: 'P-001',
    title: '登录崩溃',
    description: '登录时应用崩溃',
    severity: 'critical',
    priority: 'urgent',
    status: 'open',
    reportedBy: 'tester1',
    assignedTo: 'developer1',
    relatedTestCaseId: null,
    relatedTestPlanId: null,
    environment: 'Chrome 120',
    stepsToReproduce: '1. 打开登录页 2. 输入凭据 3. 点击登录',
    expectedBehavior: '正常登录',
    actualBehavior: '应用崩溃',
    tags: [],
    ...overrides,
  } as Omit<Defect, 'id' | 'createdAt' | 'updatedAt'>;
}

function makeTestPlan(overrides: Partial<TestPlan> = {}): Omit<TestPlan, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    projectId: 'P-001',
    name: 'S 1.0',
    description: '测试计划',
    status: 'planning',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    createdBy: 'pm1',
    assignedTo: ['tester1'],
    testCaseIds: [],
    progress: 0,
    passCount: 0,
    failCount: 0,
    blockedCount: 0,
    pendingCount: 0,
    ...overrides,
  } as Omit<TestPlan, 'id' | 'createdAt' | 'updatedAt'>;
}

describe('InMemoryTestCaseRepository', () => {
  it('should create and find by id', async () => {
    const repo = getTestCaseRepository();
    const created = await repo.create(makeTestCase());
    const found = await repo.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe('登录测试');
  });

  it('should list all', async () => {
    const repo = getTestCaseRepository();
    await repo.create(makeTestCase());
    await repo.create(makeTestCase({ title: 'Another' }));
    const result = await repo.findByQuery({ page: 1, pageSize: 100, sortBy: 'createdAt', sortOrder: 'desc' });
    expect(result.items.length).toBeGreaterThanOrEqual(2);
  });

  it('should update', async () => {
    const repo = getTestCaseRepository();
    const created = await repo.create(makeTestCase());
    const updated = await repo.update(created.id, { title: '更新标题' });
    expect(updated.title).toBe('更新标题');
  });

  it('should delete', async () => {
    const repo = getTestCaseRepository();
    const created = await repo.create(makeTestCase());
    await repo.delete(created.id);
    const found = await repo.findById(created.id);
    expect(found).toBeNull();
  });

  it('should count', async () => {
    const repo = getTestCaseRepository();
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

describe('InMemoryDefectRepository', () => {
  it('should create and find', async () => {
    const repo = getDefectRepository();
    const created = await repo.create(makeDefect());
    const found = await repo.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe('登录崩溃');
  });

  it('should update', async () => {
    const repo = getDefectRepository();
    const created = await repo.create(makeDefect());
    const updated = await repo.update(created.id, { title: '修复崩溃' });
    expect(updated.title).toBe('修复崩溃');
  });

  it('should delete', async () => {
    const repo = getDefectRepository();
    const created = await repo.create(makeDefect());
    await repo.delete(created.id);
    const found = await repo.findById(created.id);
    expect(found).toBeNull();
  });

  it('should count', async () => {
    const repo = getDefectRepository();
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

describe('InMemoryTestPlanRepository', () => {
  it('should create and find', async () => {
    const repo = getTestPlanRepository();
    const created = await repo.create(makeTestPlan());
    const found = await repo.findById(created.id);
    expect(found).not.toBeNull();
    expect(found!.name).toBe('S 1.0');
  });

  it('should update', async () => {
    const repo = getTestPlanRepository();
    const created = await repo.create(makeTestPlan());
    const updated = await repo.update(created.id, { name: '新计划' });
    expect(updated.name).toBe('新计划');
  });

  it('should delete', async () => {
    const repo = getTestPlanRepository();
    const created = await repo.create(makeTestPlan());
    await repo.delete(created.id);
    const found = await repo.findById(created.id);
    expect(found).toBeNull();
  });

  it('should count', async () => {
    const repo = getTestPlanRepository();
    const count = await repo.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
