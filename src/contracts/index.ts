/**
 * 契约层统一导出
 * 避免命名冲突，使用命名空间方式导出
 */

// 通用契约
export {
  PrioritySchema,
  SeveritySchema,
  TestCaseStatusSchema,
  DefectStatusSchema,
  TestPlanStatusSchema,
  TestCaseTypeSchema,
  PaginationParamsSchema,
  SortParamsSchema,
  DateRangeSchema,
} from './common.contract';
export type {
  Priority,
  Severity,
  TestCaseStatus,
  DefectStatus,
  TestPlanStatus,
  TestCaseType,
  PaginationParams,
  SortParams,
  DateRange,
} from './common.contract';

// 用例契约
export {
  CreateTestCaseInputSchema,
  UpdateTestCaseInputSchema,
  TestCaseQuerySchema,
  TestCaseOutputSchema,
} from './testcase.contract';
export type { CreateTestCaseInput, TestCaseQuery, TestCaseOutput } from './testcase.contract';

// 缺陷契约
export {
  CreateDefectInputSchema,
  UpdateDefectInputSchema,
  DefectQuerySchema,
  DefectOutputSchema,
  DefectSeveritySchema,
  DefectPrioritySchema,
  DefectStatusSchema as DefectStatusEnumSchema,
} from './defect.contract';
export type { CreateDefectInput, DefectQuery, DefectOutput } from './defect.contract';

// 测试计划契约
export {
  CreateTestPlanInputSchema,
  UpdateTestPlanInputSchema,
  TestPlanQuerySchema,
  TestPlanOutputSchema,
} from './testplan.contract';
export type { CreateTestPlanInput, TestPlanQuery, TestPlanOutput } from './testplan.contract';

// 项目契约
export {
  CreateProjectInputSchema,
  ProjectOutputSchema,
} from './project.contract';
export type { CreateProjectInput, ProjectOutput } from './project.contract';

// 业务规则契约
export {
  PassRateRuleSchema,
  validateStatusTransition,
  calculatePassRate,
} from './business-rules.contract';
