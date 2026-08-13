/**
 * 契约层验证测试
 * 验证所有 Zod Schema 契约的正确性
 */
import { describe, it, expect } from 'vitest';
import {
  CreateTestCaseInputSchema,
  PrioritySchema,
  TestCaseTypeSchema,
  TestCaseStatusSchema,
  TestCaseErrorCodes,
  TestStepContractSchema,
} from '@/contracts/testcase.contract';
import {
  CreateDefectInputSchema,
  DefectStatusSchema,
  DefectSeveritySchema,
  DefectErrorCodes,
} from '@/contracts/defect.contract';
import {
  CreateTestPlanInputSchema,
  TestPlanStatusSchema,
  TestPlanErrorCodes,
} from '@/contracts/testplan.contract';

describe('TestCase Contract', () => {
  it('合法输入通过校验', () => {
    const result = CreateTestCaseInputSchema.safeParse({
      title: '登录功能测试',
      description: '测试登录功能',
      module: '用户模块',
      priority: 'P0',
      type: 'functional',
      steps: [{ order: 1, action: '打开登录页面', expected: '显示登录表单' }],
      expectedResult: '登录成功',
      tags: ['登录'],
    });
    expect(result.success).toBe(true);
  });

  it('标题为空时校验失败', () => {
    const result = CreateTestCaseInputSchema.safeParse({
      title: '',
      module: '用户模块',
      priority: 'P0',
      type: 'functional',
      steps: [{ order: 1, action: '测试', expected: '结果' }],
    });
    expect(result.success).toBe(false);
  });

  it('优先级枚举正确', () => {
    expect(PrioritySchema.options).toEqual(['P0', 'P1', 'P2', 'P3']);
  });

  it('用例类型枚举正确', () => {
    expect(TestCaseTypeSchema.options).toEqual([
      'functional', 'performance', 'security', 'compatibility', 'usability',
    ]);
  });

  it('用例状态枚举正确', () => {
    expect(TestCaseStatusSchema.options).toEqual(['draft', 'active', 'deprecated']);
  });

  it('步骤契约要求 order/action/expected', () => {
    const valid = TestStepContractSchema.safeParse({ order: 1, action: '点击', expected: '响应' });
    const invalid = TestStepContractSchema.safeParse({ order: 1 });
    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });

  it('错误码枚举包含预期值', () => {
    expect(TestCaseErrorCodes.options).toContain('TEST_CASE_NOT_FOUND');
    expect(TestCaseErrorCodes.options).toContain('TEST_CASE_INVALID_STEPS');
    expect(TestCaseErrorCodes.options).toContain('TEST_CASE_TITLE_DUPLICATE');
  });
});

describe('Defect Contract', () => {
  it('合法输入通过校验', () => {
    const result = CreateDefectInputSchema.safeParse({
      title: '登录崩溃',
      description: '登录时应用崩溃',
      severity: 'critical',
      priority: 'urgent',
      moduleId: 'M1',
      assignedTo: 'developer1',
    });
    expect(result.success).toBe(true);
  });

  it('严重程度枚举正确', () => {
    expect(DefectSeveritySchema.options).toEqual(['critical', 'major', 'minor', 'trivial']);
  });

  it('缺陷状态枚举正确', () => {
    expect(DefectStatusSchema.options).toEqual([
      'open', 'confirmed', 'in_progress', 'resolved', 'closed', 'rejected',
    ]);
  });

  it('错误码枚举包含预期值', () => {
    expect(DefectErrorCodes.options).toContain('DEFECT_NOT_FOUND');
    expect(DefectErrorCodes.options).toContain('DEFECT_INVALID_STATUS_TRANSITION');
  });
});

describe('TestPlan Contract', () => {
  it('合法输入通过校验', () => {
    const result = CreateTestPlanInputSchema.safeParse({
      name: 'Sprint 1 测试计划',
      projectId: 'project-1',
      status: 'planning',
      startDate: '2026-01-01',
      endDate: '2026-01-31',
      assignedTo: ['developer1'],
      testCaseIds: ['tc-1'],
    });
    expect(result.success).toBe(true);
  });

  it('计划状态枚举正确', () => {
    expect(TestPlanStatusSchema.options).toEqual(['planning', 'in_progress', 'completed', 'cancelled']);
  });

  it('错误码枚举包含预期值', () => {
    expect(TestPlanErrorCodes.options).toContain('TEST_PLAN_NOT_FOUND');
    expect(TestPlanErrorCodes.options).toContain('TEST_PLAN_DATE_INVALID');
  });
});
