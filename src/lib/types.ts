// ============ 核心类型定义 ============

// 项目
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  coverColor: string;
}

// 测试用例
export interface TestCase {
  id: string;
  projectId: string;
  title: string;
  description: string;
  module: string;
  priority: 'P0' | 'P1' | 'P2' | 'P3';
  type: 'functional' | 'performance' | 'security' | 'compatibility' | 'usability';
  status: 'draft' | 'active' | 'deprecated';
  precondition: string;
  steps: TestStep[];
  expectedResult: string;
  tags: string[];
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt: string | null;
  passRate: number;
  executionCount: number;
}

export interface TestStep {
  order: number;
  action: string;
  expected: string;
}

// 测试计划
export interface TestPlan {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  createdBy: string;
  assignedTo: string[];
  testCaseIds: string[];
  progress: number;
  passCount: number;
  failCount: number;
  blockedCount: number;
  pendingCount: number;
  createdAt: string;
  updatedAt: string;
}

// 测试执行记录
export interface TestExecution {
  id: string;
  testPlanId: string;
  testCaseId: string;
  status: 'passed' | 'failed' | 'blocked' | 'skipped' | 'running';
  executedBy: string;
  executedAt: string;
  duration: number; // ms
  comment: string;
  attachments: string[];
  environment: string;
}

// 缺陷
export interface Defect {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: 'critical' | 'major' | 'minor' | 'trivial';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'open' | 'confirmed' | 'in_progress' | 'resolved' | 'closed' | 'rejected';
  reportedBy: string;
  assignedTo: string;
  relatedTestCaseId: string | null;
  relatedTestPlanId: string | null;
  environment: string;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

// 团队成员
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'manager' | 'tester' | 'developer';
  projectId: string;
}

// 测试报告
export interface TestReport {
  id: string;
  projectId: string;
  testPlanId: string;
  title: string;
  summary: string;
  totalCases: number;
  passed: number;
  failed: number;
  blocked: number;
  skipped: number;
  passRate: number;
  coverageRate: number;
  generatedAt: string;
  generatedBy: string;
}

// 组件 Vibe 目录项
export interface VibeComponent {
  id: string;
  name: string;
  level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4';
  category: string;
  description: string;
  vibeStatus: 'defined' | 'in_progress' | 'review' | 'approved';
  hasContract: boolean;
  hasRules: boolean;
  hasTests: boolean;
  hasEvolution: boolean;
  version: string;
  lastUpdated: string;
  owner: string;
}

// Dashboard 统计
export interface DashboardStats {
  totalCases: number;
  totalPlans: number;
  totalDefects: number;
  passRate: number;
  defectTrend: { date: string; open: number; resolved: number }[];
  executionTrend: { date: string; passed: number; failed: number; blocked: number }[];
  moduleDistribution: { module: string; count: number }[];
  priorityDistribution: { priority: string; count: number }[];
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'case_created' | 'case_updated' | 'plan_created' | 'plan_completed' | 'defect_reported' | 'defect_resolved' | 'execution_completed';
  title: string;
  description: string;
  user: string;
  timestamp: string;
}

// 筛选器类型
export interface FilterState {
  search: string;
  status: string[];
  priority: string[];
  module: string[];
  type: string[];
  assignee: string[];
  dateRange: { start: string | null; end: string | null };
}

// 分页
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// 排序
export interface SortState {
  field: string;
  direction: 'asc' | 'desc';
}
