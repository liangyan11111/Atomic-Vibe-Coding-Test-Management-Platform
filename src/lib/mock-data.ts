import type {
  Project, TestCase, TestPlan, TestExecution,
  Defect, TeamMember, TestReport, VibeComponent,
  DashboardStats, Activity
} from './types';

// ============ 项目 ============
export const projects: Project[] = [
  {
    id: 'proj-001',
    name: 'Vibe Studio 主站',
    description: 'AI 原生工作台核心产品，包含组件管理、Vibe 对话、代码生成等核心功能',
    status: 'active',
    memberCount: 12,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2025-08-10T14:30:00Z',
    coverColor: '#4F46E5',
  },
  {
    id: 'proj-002',
    name: 'Guard Layer 安全网关',
    description: 'AI 代码隔离运行时与安全沙箱，负责代码审查、安全扫描、权限管控',
    status: 'active',
    memberCount: 8,
    createdAt: '2025-03-01T08:00:00Z',
    updatedAt: '2025-08-09T10:00:00Z',
    coverColor: '#0EA5E9',
  },
  {
    id: 'proj-003',
    name: 'Contract Engine 契约引擎',
    description: '组件级契约校验系统，支持 Zod Schema 校验、契约版本管理、自动化合规检查',
    status: 'active',
    memberCount: 6,
    createdAt: '2025-04-10T08:00:00Z',
    updatedAt: '2025-08-08T16:00:00Z',
    coverColor: '#10B981',
  },
  {
    id: 'proj-004',
    name: 'Component Portal 组件门户',
    description: '组件 Vibe 百科展示平台，组件搜索、预览、版本对比',
    status: 'active',
    memberCount: 5,
    createdAt: '2025-05-20T08:00:00Z',
    updatedAt: '2025-08-07T09:00:00Z',
    coverColor: '#F59E0B',
  },
];

// ============ 团队成员 ============
export const teamMembers: TeamMember[] = [
  { id: 'user-001', name: '张明', email: 'zhangming@test.com', avatar: 'ZM', role: 'admin', projectId: 'proj-001' },
  { id: 'user-002', name: '李薇', email: 'liwei@test.com', avatar: 'LW', role: 'manager', projectId: 'proj-001' },
  { id: 'user-003', name: '王浩', email: 'wanghao@test.com', avatar: 'WH', role: 'tester', projectId: 'proj-001' },
  { id: 'user-004', name: '赵雪', email: 'zhaoxue@test.com', avatar: 'ZX', role: 'tester', projectId: 'proj-001' },
  { id: 'user-005', name: '陈刚', email: 'chengang@test.com', avatar: 'CG', role: 'developer', projectId: 'proj-001' },
  { id: 'user-006', name: '刘芳', email: 'liufang@test.com', avatar: 'LF', role: 'tester', projectId: 'proj-002' },
  { id: 'user-007', name: '孙伟', email: 'sunwei@test.com', avatar: 'SW', role: 'developer', projectId: 'proj-002' },
  { id: 'user-008', name: '周丽', email: 'zhouli@test.com', avatar: 'ZL', role: 'manager', projectId: 'proj-003' },
];

const modules = ['用户认证', 'API 网关', '数据管理', 'UI 组件', '安全模块', '性能优化', '集成测试', '部署流水线'];
const tags = ['冒烟测试', '回归测试', '接口测试', 'UI 测试', '边界测试', '并发测试', '兼容性', 'P0 场景'];

// ============ 测试用例 ============
export const testCases: TestCase[] = [
  {
    id: 'TC-001', projectId: 'proj-001', title: '用户登录 - 正确凭证验证',
    description: '验证用户使用正确的邮箱和密码能够成功登录系统',
    module: '用户认证', priority: 'P0', type: 'functional', status: 'active',
    precondition: '用户已注册且账户状态正常',
    steps: [
      { order: 1, action: '打开登录页面', expected: '显示登录表单' },
      { order: 2, action: '输入正确的邮箱和密码', expected: '输入框显示对应内容' },
      { order: 3, action: '点击登录按钮', expected: '成功跳转到首页' },
    ],
    expectedResult: '用户成功登录并跳转到首页，显示用户头像和名称',
    tags: ['冒烟测试', 'P0 场景'], createdBy: 'user-002', assignedTo: 'user-003',
    createdAt: '2025-06-01T08:00:00Z', updatedAt: '2025-08-10T14:30:00Z',
    lastExecutedAt: '2025-08-10T14:00:00Z', passRate: 98.5, executionCount: 134,
  },
  {
    id: 'TC-002', projectId: 'proj-001', title: '用户登录 - 错误密码锁定',
    description: '验证连续输入错误密码5次后账户被锁定30分钟',
    module: '用户认证', priority: 'P0', type: 'security', status: 'active',
    precondition: '用户已注册且账户未被锁定',
    steps: [
      { order: 1, action: '打开登录页面', expected: '显示登录表单' },
      { order: 2, action: '连续5次输入错误密码', expected: '第5次提示账户已锁定' },
      { order: 3, action: '尝试使用正确密码登录', expected: '提示账户已锁定，请30分钟后重试' },
    ],
    expectedResult: '账户被锁定30分钟，显示倒计时提示',
    tags: ['安全测试', 'P0 场景'], createdBy: 'user-002', assignedTo: 'user-004',
    createdAt: '2025-06-02T08:00:00Z', updatedAt: '2025-08-09T10:00:00Z',
    lastExecutedAt: '2025-08-09T09:00:00Z', passRate: 100, executionCount: 89,
  },
  {
    id: 'TC-003', projectId: 'proj-001', title: 'API 接口 - 速率限制验证',
    description: '验证 API 网关的速率限制功能，每分钟超过100次请求时返回 429',
    module: 'API 网关', priority: 'P1', type: 'performance', status: 'active',
    precondition: 'API 服务正常运行',
    steps: [
      { order: 1, action: '使用脚本发送100次请求', expected: '所有请求正常返回 200' },
      { order: 2, action: '继续发送第101次请求', expected: '返回 429 Too Many Requests' },
      { order: 3, action: '等待60秒后再次请求', expected: '请求恢复正常' },
    ],
    expectedResult: '速率限制正确触发，返回 429 状态码和重试时间',
    tags: ['接口测试', '并发测试'], createdBy: 'user-005', assignedTo: 'user-003',
    createdAt: '2025-06-05T08:00:00Z', updatedAt: '2025-08-08T16:00:00Z',
    lastExecutedAt: '2025-08-08T15:00:00Z', passRate: 95.2, executionCount: 67,
  },
  {
    id: 'TC-004', projectId: 'proj-001', title: '数据导出 - 大数据量 CSV 导出',
    description: '验证导出10万条数据为 CSV 文件的性能和完整性',
    module: '数据管理', priority: 'P1', type: 'performance', status: 'active',
    precondition: '数据库中有10万条测试数据',
    steps: [
      { order: 1, action: '选择导出数据范围（10万条）', expected: '显示导出进度条' },
      { order: 2, action: '等待导出完成', expected: '下载 CSV 文件' },
      { order: 3, action: '验证 CSV 文件内容', expected: '数据行数和内容与源数据一致' },
    ],
    expectedResult: '导出在30秒内完成，数据完整无丢失',
    tags: ['性能测试', '边界测试'], createdBy: 'user-003', assignedTo: 'user-004',
    createdAt: '2025-06-10T08:00:00Z', updatedAt: '2025-08-07T09:00:00Z',
    lastExecutedAt: '2025-08-07T08:00:00Z', passRate: 87.3, executionCount: 45,
  },
  {
    id: 'TC-005', projectId: 'proj-001', title: 'UI 组件 - 搜索框防抖验证',
    description: '验证搜索输入框的防抖功能，300ms 后才触发搜索请求',
    module: 'UI 组件', priority: 'P2', type: 'functional', status: 'active',
    precondition: '搜索组件已加载',
    steps: [
      { order: 1, action: '在搜索框中快速输入文字', expected: '输入过程中不触发搜索' },
      { order: 2, action: '停止输入等待300ms', expected: '触发搜索请求并显示 loading' },
      { order: 3, action: '查看搜索结果', expected: '正确显示匹配结果' },
    ],
    expectedResult: '防抖功能正常工作，减少不必要的 API 请求',
    tags: ['UI 测试', '回归测试'], createdBy: 'user-004', assignedTo: 'user-003',
    createdAt: '2025-06-15T08:00:00Z', updatedAt: '2025-08-06T11:00:00Z',
    lastExecutedAt: '2025-08-06T10:00:00Z', passRate: 100, executionCount: 156,
  },
  {
    id: 'TC-006', projectId: 'proj-002', title: '安全沙箱 - 文件系统隔离验证',
    description: '验证 AI 代码运行时只能访问 /tmp/ai-workspace 目录',
    module: '安全模块', priority: 'P0', type: 'security', status: 'active',
    precondition: '安全沙箱环境已启动',
    steps: [
      { order: 1, action: '在沙箱中尝试读取 /etc/passwd', expected: '操作被拒绝' },
      { order: 2, action: '在沙箱中尝试写入 /tmp/ai-workspace/test.txt', expected: '写入成功' },
      { order: 3, action: '在沙箱中尝试写入 /home/user/', expected: '操作被拒绝' },
    ],
    expectedResult: '文件系统隔离正确，仅允许访问指定目录',
    tags: ['安全测试', 'P0 场景'], createdBy: 'user-006', assignedTo: 'user-007',
    createdAt: '2025-07-01T08:00:00Z', updatedAt: '2025-08-10T08:00:00Z',
    lastExecutedAt: '2025-08-10T07:00:00Z', passRate: 100, executionCount: 78,
  },
  {
    id: 'TC-007', projectId: 'proj-002', title: '网络策略 - 外部访问拦截',
    description: '验证沙箱环境中禁止访问外部网络',
    module: '安全模块', priority: 'P0', type: 'security', status: 'active',
    precondition: '安全沙箱环境已启动',
    steps: [
      { order: 1, action: '在沙箱中尝试 curl 外部 URL', expected: '请求被拦截' },
      { order: 2, action: '在沙箱中尝试访问内部 Mock 服务', expected: '请求正常返回' },
    ],
    expectedResult: '外部网络被拦截，内部服务可正常访问',
    tags: ['安全测试', '接口测试'], createdBy: 'user-006', assignedTo: 'user-007',
    createdAt: '2025-07-05T08:00:00Z', updatedAt: '2025-08-09T14:00:00Z',
    lastExecutedAt: '2025-08-09T13:00:00Z', passRate: 96.8, executionCount: 62,
  },
  {
    id: 'TC-008', projectId: 'proj-003', title: '契约校验 - Zod Schema 验证',
    description: '验证组件契约校验器能正确识别不符合 Zod Schema 的输入',
    module: '集成测试', priority: 'P1', type: 'functional', status: 'active',
    precondition: '契约引擎服务已启动',
    steps: [
      { order: 1, action: '发送符合 Schema 的数据', expected: '校验通过' },
      { order: 2, action: '发送缺少必填字段的数据', expected: '返回校验错误' },
      { order: 3, action: '发送类型错误的数据', expected: '返回类型不匹配错误' },
    ],
    expectedResult: '校验器正确识别所有不合规输入并返回明确错误信息',
    tags: ['接口测试', '回归测试'], createdBy: 'user-008', assignedTo: 'user-003',
    createdAt: '2025-07-10T08:00:00Z', updatedAt: '2025-08-08T10:00:00Z',
    lastExecutedAt: '2025-08-08T09:00:00Z', passRate: 92.1, executionCount: 98,
  },
  {
    id: 'TC-009', projectId: 'proj-001', title: '响应式布局 - 移动端适配',
    description: '验证主要页面在移动端（375px 宽度）的布局正确性',
    module: 'UI 组件', priority: 'P2', type: 'compatibility', status: 'active',
    precondition: '准备移动设备或浏览器开发者工具',
    steps: [
      { order: 1, action: '将浏览器宽度调整为 375px', expected: '侧边栏自动折叠' },
      { order: 2, action: '检查表格布局', expected: '表格支持横向滚动' },
      { order: 3, action: '检查弹窗布局', expected: '弹窗全宽显示' },
    ],
    expectedResult: '所有页面在移动端正常显示，无内容溢出或截断',
    tags: ['UI 测试', '兼容性'], createdBy: 'user-004', assignedTo: 'user-004',
    createdAt: '2025-07-15T08:00:00Z', updatedAt: '2025-08-05T16:00:00Z',
    lastExecutedAt: '2025-08-05T15:00:00Z', passRate: 85.7, executionCount: 42,
  },
  {
    id: 'TC-010', projectId: 'proj-001', title: 'WebSocket 连接 - 断线重连',
    description: '验证 WebSocket 连接断开后能自动重连并恢复数据同步',
    module: '集成测试', priority: 'P1', type: 'functional', status: 'active',
    precondition: 'WebSocket 服务已启动',
    steps: [
      { order: 1, action: '建立 WebSocket 连接', expected: '连接成功，显示在线状态' },
      { order: 2, action: '模拟网络断开', expected: '显示重连提示' },
      { order: 3, action: '恢复网络', expected: '自动重连并同步缺失数据' },
    ],
    expectedResult: '断线后5秒内自动重连，数据无丢失',
    tags: ['接口测试', '回归测试'], createdBy: 'user-005', assignedTo: 'user-003',
    createdAt: '2025-07-20T08:00:00Z', updatedAt: '2025-08-04T11:00:00Z',
    lastExecutedAt: '2025-08-04T10:00:00Z', passRate: 91.3, executionCount: 55,
  },
  {
    id: 'TC-011', projectId: 'proj-004', title: '组件搜索 - 全文检索',
    description: '验证组件门户的全文检索功能，支持按名称、描述、标签搜索',
    module: '数据管理', priority: 'P1', type: 'functional', status: 'active',
    precondition: '组件库中已有50+组件',
    steps: [
      { order: 1, action: '在搜索框输入组件名称关键字', expected: '实时显示匹配结果' },
      { order: 2, action: '输入标签关键字', expected: '显示包含该标签的组件' },
      { order: 3, action: '清空搜索', expected: '恢复全部组件列表' },
    ],
    expectedResult: '搜索结果准确，响应时间 < 200ms',
    tags: ['接口测试', '性能测试'], createdBy: 'user-008', assignedTo: 'user-004',
    createdAt: '2025-07-25T08:00:00Z', updatedAt: '2025-08-03T14:00:00Z',
    lastExecutedAt: '2025-08-03T13:00:00Z', passRate: 94.6, executionCount: 73,
  },
  {
    id: 'TC-012', projectId: 'proj-001', title: '文件上传 - 大小限制验证',
    description: '验证文件上传功能对超过10MB文件的限制',
    module: '数据管理', priority: 'P2', type: 'functional', status: 'draft',
    precondition: '用户已登录',
    steps: [
      { order: 1, action: '上传 5MB 文件', expected: '上传成功' },
      { order: 2, action: '上传 15MB 文件', expected: '提示文件超过大小限制' },
    ],
    expectedResult: '超过限制的文件被拒绝，显示友好提示',
    tags: ['边界测试', 'UI 测试'], createdBy: 'user-003', assignedTo: 'user-003',
    createdAt: '2025-08-01T08:00:00Z', updatedAt: '2025-08-01T08:00:00Z',
    lastExecutedAt: null, passRate: 0, executionCount: 0,
  },
  {
    id: 'TC-013', projectId: 'proj-002', title: '审计日志 - 操作记录完整性',
    description: '验证所有敏感操作都被正确记录到审计日志',
    module: '安全模块', priority: 'P1', type: 'security', status: 'active',
    precondition: '审计日志服务已启动',
    steps: [
      { order: 1, action: '执行创建操作', expected: '日志记录创建事件' },
      { order: 2, action: '执行修改操作', expected: '日志记录修改事件和变更内容' },
      { order: 3, action: '执行删除操作', expected: '日志记录删除事件' },
    ],
    expectedResult: '所有操作都有完整的审计记录，包含时间、用户、操作类型、变更内容',
    tags: ['安全测试', '回归测试'], createdBy: 'user-006', assignedTo: 'user-006',
    createdAt: '2025-08-02T08:00:00Z', updatedAt: '2025-08-09T16:00:00Z',
    lastExecutedAt: '2025-08-09T15:00:00Z', passRate: 97.5, executionCount: 40,
  },
  {
    id: 'TC-014', projectId: 'proj-003', title: '契约版本管理 - 向后兼容检查',
    description: '验证契约版本升级时的向后兼容性检查',
    module: '集成测试', priority: 'P1', type: 'functional', status: 'active',
    precondition: '存在多个版本的契约定义',
    steps: [
      { order: 1, action: '创建契约新版本（新增可选字段）', expected: '标记为兼容升级' },
      { order: 2, action: '创建契约新版本（删除必填字段）', expected: '标记为不兼容升级' },
      { order: 3, action: '查看版本对比', expected: '显示差异和影响范围' },
    ],
    expectedResult: '版本管理正确识别兼容性，提供清晰的升级指引',
    tags: ['接口测试'], createdBy: 'user-008', assignedTo: 'user-007',
    createdAt: '2025-08-03T08:00:00Z', updatedAt: '2025-08-08T12:00:00Z',
    lastExecutedAt: '2025-08-08T11:00:00Z', passRate: 88.9, executionCount: 27,
  },
  {
    id: 'TC-015', projectId: 'proj-001', title: '国际化 - 中英文切换',
    description: '验证系统支持中英文切换，所有文案正确翻译',
    module: 'UI 组件', priority: 'P3', type: 'usability', status: 'active',
    precondition: '系统已配置中英文语言包',
    steps: [
      { order: 1, action: '切换语言为英文', expected: '所有界面文案变为英文' },
      { order: 2, action: '切换语言为中文', expected: '所有界面文案变为中文' },
      { order: 3, action: '检查日期格式', expected: '日期格式跟随语言设置' },
    ],
    expectedResult: '语言切换流畅，无遗漏未翻译文案',
    tags: ['UI 测试', '兼容性'], createdBy: 'user-004', assignedTo: 'user-004',
    createdAt: '2025-08-05T08:00:00Z', updatedAt: '2025-08-07T14:00:00Z',
    lastExecutedAt: '2025-08-07T13:00:00Z', passRate: 78.5, executionCount: 31,
  },
  {
    id: 'TC-016', projectId: 'proj-001', title: '缓存策略 - 静态资源缓存验证',
    description: '验证静态资源的缓存策略，确保 CDN 缓存命中率和更新机制',
    module: '性能优化', priority: 'P2', type: 'performance', status: 'deprecated',
    precondition: 'CDN 配置已完成',
    steps: [
      { order: 1, action: '首次加载页面', expected: '静态资源从服务器加载' },
      { order: 2, action: '刷新页面', expected: '静态资源从缓存加载' },
      { order: 3, action: '发布新版本后加载', expected: '新资源正确加载' },
    ],
    expectedResult: '缓存策略正确，版本更新后资源及时刷新',
    tags: ['性能测试'], createdBy: 'user-005', assignedTo: 'user-005',
    createdAt: '2025-05-01T08:00:00Z', updatedAt: '2025-07-01T08:00:00Z',
    lastExecutedAt: '2025-07-01T07:00:00Z', passRate: 82.1, executionCount: 28,
  },
];

// ============ 测试计划 ============
export const testPlans: TestPlan[] = [
  {
    id: 'TP-001', projectId: 'proj-001', name: 'v2.5.0 发布前回归测试',
    description: 'v2.5.0 版本发布前的全量回归测试，覆盖所有 P0/P1 用例',
    status: 'in_progress', startDate: '2025-08-05T00:00:00Z', endDate: '2025-08-15T00:00:00Z',
    createdBy: 'user-002', assignedTo: ['user-003', 'user-004'],
    testCaseIds: ['TC-001', 'TC-002', 'TC-003', 'TC-005', 'TC-009', 'TC-010'],
    progress: 67, passCount: 4, failCount: 1, blockedCount: 0, pendingCount: 1,
    createdAt: '2025-08-04T08:00:00Z', updatedAt: '2025-08-10T14:30:00Z',
  },
  {
    id: 'TP-002', projectId: 'proj-001', name: '用户认证模块安全测试',
    description: '针对用户认证模块的安全专项测试',
    status: 'completed', startDate: '2025-07-20T00:00:00Z', endDate: '2025-07-30T00:00:00Z',
    createdBy: 'user-002', assignedTo: ['user-003', 'user-004'],
    testCaseIds: ['TC-001', 'TC-002'],
    progress: 100, passCount: 2, failCount: 0, blockedCount: 0, pendingCount: 0,
    createdAt: '2025-07-19T08:00:00Z', updatedAt: '2025-07-30T16:00:00Z',
  },
  {
    id: 'TP-003', projectId: 'proj-002', name: '安全沙箱 v1.2 验收测试',
    description: '安全沙箱 v1.2 版本的验收测试，包含文件系统隔离、网络策略、超时机制',
    status: 'in_progress', startDate: '2025-08-08T00:00:00Z', endDate: '2025-08-18T00:00:00Z',
    createdBy: 'user-006', assignedTo: ['user-006', 'user-007'],
    testCaseIds: ['TC-006', 'TC-007', 'TC-013'],
    progress: 45, passCount: 1, failCount: 0, blockedCount: 1, pendingCount: 1,
    createdAt: '2025-08-07T08:00:00Z', updatedAt: '2025-08-10T10:00:00Z',
  },
  {
    id: 'TP-004', projectId: 'proj-003', name: '契约引擎集成测试',
    description: '契约引擎核心功能的集成测试',
    status: 'planning', startDate: '2025-08-15T00:00:00Z', endDate: '2025-08-25T00:00:00Z',
    createdBy: 'user-008', assignedTo: ['user-003', 'user-007'],
    testCaseIds: ['TC-008', 'TC-014'],
    progress: 0, passCount: 0, failCount: 0, blockedCount: 0, pendingCount: 2,
    createdAt: '2025-08-10T08:00:00Z', updatedAt: '2025-08-10T08:00:00Z',
  },
  {
    id: 'TP-005', projectId: 'proj-001', name: 'v2.4.0 性能基准测试',
    description: 'v2.4.0 版本的性能基准测试，建立性能基线',
    status: 'completed', startDate: '2025-07-10T00:00:00Z', endDate: '2025-07-20T00:00:00Z',
    createdBy: 'user-002', assignedTo: ['user-003', 'user-005'],
    testCaseIds: ['TC-003', 'TC-004', 'TC-016'],
    progress: 100, passCount: 2, failCount: 1, blockedCount: 0, pendingCount: 0,
    createdAt: '2025-07-09T08:00:00Z', updatedAt: '2025-07-20T16:00:00Z',
  },
];

// ============ 测试执行记录 ============
export const testExecutions: TestExecution[] = [
  { id: 'TE-001', testPlanId: 'TP-001', testCaseId: 'TC-001', status: 'passed', executedBy: 'user-003', executedAt: '2025-08-10T14:00:00Z', duration: 3200, comment: '登录流程正常', attachments: [], environment: 'staging' },
  { id: 'TE-002', testPlanId: 'TP-001', testCaseId: 'TC-002', status: 'passed', executedBy: 'user-004', executedAt: '2025-08-10T13:30:00Z', duration: 5800, comment: '锁定机制正常', attachments: [], environment: 'staging' },
  { id: 'TE-003', testPlanId: 'TP-001', testCaseId: 'TC-003', status: 'failed', executedBy: 'user-003', executedAt: '2025-08-10T11:00:00Z', duration: 120000, comment: '速率限制阈值与预期不符，实际为120次/分钟', attachments: ['screenshot-001.png'], environment: 'staging' },
  { id: 'TE-004', testPlanId: 'TP-001', testCaseId: 'TC-005', status: 'passed', executedBy: 'user-003', executedAt: '2025-08-09T16:00:00Z', duration: 2100, comment: '防抖正常', attachments: [], environment: 'staging' },
  { id: 'TE-005', testPlanId: 'TP-001', testCaseId: 'TC-010', status: 'passed', executedBy: 'user-003', executedAt: '2025-08-09T14:00:00Z', duration: 45000, comment: '重连机制正常', attachments: [], environment: 'staging' },
  { id: 'TE-006', testPlanId: 'TP-003', testCaseId: 'TC-006', status: 'passed', executedBy: 'user-006', executedAt: '2025-08-10T07:00:00Z', duration: 8500, comment: '文件隔离正确', attachments: [], environment: 'sandbox' },
  { id: 'TE-007', testPlanId: 'TP-003', testCaseId: 'TC-007', status: 'blocked', executedBy: 'user-007', executedAt: '2025-08-09T13:00:00Z', duration: 0, comment: 'Mock 服务暂时不可用', attachments: [], environment: 'sandbox' },
];

// ============ 缺陷 ============
export const defects: Defect[] = [
  {
    id: 'DEF-001', projectId: 'proj-001', title: 'API 速率限制阈值与文档不一致',
    description: '文档标注速率限制为100次/分钟，实际测试发现为120次/分钟',
    severity: 'major', priority: 'high', status: 'open',
    reportedBy: 'user-003', assignedTo: 'user-005',
    relatedTestCaseId: 'TC-003', relatedTestPlanId: 'TP-001',
    environment: 'staging',
    stepsToReproduce: '1. 发送100次请求\n2. 观察是否返回429\n3. 继续发送到120次才触发限制',
    expectedBehavior: '100次/分钟后返回429',
    actualBehavior: '120次/分钟后才返回429',
    tags: ['API', '配置'], createdAt: '2025-08-10T11:30:00Z', updatedAt: '2025-08-10T11:30:00Z', resolvedAt: null,
  },
  {
    id: 'DEF-002', projectId: 'proj-001', title: '移动端表格横向滚动时表头固定失效',
    description: '在375px宽度下，表格横向滚动时表头未固定，导致无法看到列名',
    severity: 'minor', priority: 'medium', status: 'confirmed',
    reportedBy: 'user-004', assignedTo: 'user-005',
    relatedTestCaseId: 'TC-009', relatedTestPlanId: 'TP-001',
    environment: 'mobile',
    stepsToReproduce: '1. 使用375px宽度打开页面\n2. 找到数据表格\n3. 横向滚动',
    expectedBehavior: '表头固定在顶部',
    actualBehavior: '表头随内容一起滚动',
    tags: ['UI', '移动端'], createdAt: '2025-08-09T15:00:00Z', updatedAt: '2025-08-09T16:00:00Z', resolvedAt: null,
  },
  {
    id: 'DEF-003', projectId: 'proj-002', title: '沙箱超时机制未正确终止长时间任务',
    description: '5分钟超时设置下，某些计算密集型任务超过7分钟仍未被终止',
    severity: 'critical', priority: 'urgent', status: 'in_progress',
    reportedBy: 'user-006', assignedTo: 'user-007',
    relatedTestCaseId: 'TC-006', relatedTestPlanId: 'TP-003',
    environment: 'sandbox',
    stepsToReproduce: '1. 在沙箱中启动计算密集型任务\n2. 等待超过5分钟\n3. 观察任务是否被终止',
    expectedBehavior: '5分钟后任务被自动终止',
    actualBehavior: '任务继续运行超过7分钟',
    tags: ['安全', '性能'], createdAt: '2025-08-08T10:00:00Z', updatedAt: '2025-08-10T09:00:00Z', resolvedAt: null,
  },
  {
    id: 'DEF-004', projectId: 'proj-001', title: 'CSV 导出大数据量时内存溢出',
    description: '导出超过8万条数据时，服务器内存使用超过2GB导致OOM',
    severity: 'critical', priority: 'high', status: 'resolved',
    reportedBy: 'user-004', assignedTo: 'user-005',
    relatedTestCaseId: 'TC-004', relatedTestPlanId: 'TP-005',
    environment: 'staging',
    stepsToReproduce: '1. 选择10万条数据\n2. 点击导出CSV\n3. 观察服务器内存',
    expectedBehavior: '使用流式导出，内存占用稳定',
    actualBehavior: '一次性加载所有数据到内存，导致OOM',
    tags: ['性能', '后端'], createdAt: '2025-07-18T14:00:00Z', updatedAt: '2025-07-25T10:00:00Z', resolvedAt: '2025-07-25T10:00:00Z',
  },
  {
    id: 'DEF-005', projectId: 'proj-003', title: '契约校验错误信息不够明确',
    description: '当嵌套对象的字段校验失败时，错误信息只显示最外层字段名',
    severity: 'minor', priority: 'low', status: 'open',
    reportedBy: 'user-003', assignedTo: 'user-008',
    relatedTestCaseId: 'TC-008', relatedTestPlanId: null,
    environment: 'staging',
    stepsToReproduce: '1. 发送嵌套对象数据\n2. 内层字段类型错误\n3. 查看错误信息',
    expectedBehavior: '显示完整路径如 data.address.zipCode',
    actualBehavior: '只显示 data.address',
    tags: ['UX', '错误处理'], createdAt: '2025-08-07T09:00:00Z', updatedAt: '2025-08-07T09:00:00Z', resolvedAt: null,
  },
  {
    id: 'DEF-006', projectId: 'proj-001', title: 'WebSocket 重连后丢失部分消息',
    description: '断线重连后，断线期间发送的消息未通过同步机制补回',
    severity: 'major', priority: 'high', status: 'in_progress',
    reportedBy: 'user-003', assignedTo: 'user-005',
    relatedTestCaseId: 'TC-010', relatedTestPlanId: 'TP-001',
    environment: 'staging',
    stepsToReproduce: '1. 建立WebSocket连接\n2. 断开网络\n3. 另一客户端发送消息\n4. 恢复网络',
    expectedBehavior: '重连后自动同步断线期间的消息',
    actualBehavior: '断线期间的消息丢失',
    tags: ['实时通信', '数据一致性'], createdAt: '2025-08-06T16:00:00Z', updatedAt: '2025-08-09T11:00:00Z', resolvedAt: null,
  },
  {
    id: 'DEF-007', projectId: 'proj-001', title: '国际化 - 日期格式在阿拉伯语环境下错误',
    description: '切换到阿拉伯语后，日期格式未正确转换为伊斯兰历',
    severity: 'trivial', priority: 'low', status: 'rejected',
    reportedBy: 'user-004', assignedTo: 'user-004',
    relatedTestCaseId: 'TC-015', relatedTestPlanId: null,
    environment: 'staging',
    stepsToReproduce: '1. 切换语言为阿拉伯语\n2. 查看日期显示',
    expectedBehavior: '显示伊斯兰历日期',
    actualBehavior: '仍显示公历日期',
    tags: ['国际化'], createdAt: '2025-08-05T10:00:00Z', updatedAt: '2025-08-06T09:00:00Z', resolvedAt: '2025-08-06T09:00:00Z',
  },
  {
    id: 'DEF-008', projectId: 'proj-002', title: '审计日志中敏感信息未脱敏',
    description: '审计日志中记录了完整的用户密码哈希值',
    severity: 'critical', priority: 'urgent', status: 'closed',
    reportedBy: 'user-007', assignedTo: 'user-006',
    relatedTestCaseId: 'TC-013', relatedTestPlanId: 'TP-003',
    environment: 'production',
    stepsToReproduce: '1. 执行用户密码修改操作\n2. 查看审计日志',
    expectedBehavior: '密码字段显示为 ***',
    actualBehavior: '密码哈希值完整记录',
    tags: ['安全', '合规'], createdAt: '2025-08-01T08:00:00Z', updatedAt: '2025-08-03T14:00:00Z', resolvedAt: '2025-08-02T16:00:00Z',
  },
];

// ============ 测试报告 ============
export const testReports: TestReport[] = [
  {
    id: 'RPT-001', projectId: 'proj-001', testPlanId: 'TP-002',
    title: '用户认证模块安全测试报告',
    summary: 'v2.4.0 用户认证模块安全专项测试完成，所有用例通过',
    totalCases: 2, passed: 2, failed: 0, blocked: 0, skipped: 0,
    passRate: 100, coverageRate: 85,
    generatedAt: '2025-07-30T16:00:00Z', generatedBy: 'user-002',
  },
  {
    id: 'RPT-002', projectId: 'proj-001', testPlanId: 'TP-005',
    title: 'v2.4.0 性能基准测试报告',
    summary: '性能基准测试完成，发现1个严重缺陷（CSV导出OOM），已修复',
    totalCases: 3, passed: 2, failed: 1, blocked: 0, skipped: 0,
    passRate: 66.7, coverageRate: 72,
    generatedAt: '2025-07-20T16:00:00Z', generatedBy: 'user-002',
  },
];

// ============ 组件 Vibe 百科 ============
export const vibeComponents: VibeComponent[] = [
  { id: 'VC-001', name: 'SearchInput', level: 'L1', category: '基础复合', description: '带防抖和清空按钮的搜索输入框', vibeStatus: 'approved', hasContract: true, hasRules: true, hasTests: true, hasEvolution: true, version: '2.1.0', lastUpdated: '2025-08-01T08:00:00Z', owner: 'user-005' },
  { id: 'VC-002', name: 'DataTable', level: 'L3', category: '数据组件', description: '支持排序、筛选、分页的数据表格', vibeStatus: 'approved', hasContract: true, hasRules: true, hasTests: true, hasEvolution: true, version: '3.0.0', lastUpdated: '2025-08-05T08:00:00Z', owner: 'user-005' },
  { id: 'VC-003', name: 'OrderForm', level: 'L2', category: '业务组件', description: '订单创建/编辑表单，含校验逻辑', vibeStatus: 'review', hasContract: true, hasRules: true, hasTests: false, hasEvolution: true, version: '1.2.0', lastUpdated: '2025-08-08T08:00:00Z', owner: 'user-003' },
  { id: 'VC-004', name: 'Modal', level: 'L1', category: '基础复合', description: '通用模态框，支持自定义内容和操作', vibeStatus: 'approved', hasContract: true, hasRules: true, hasTests: true, hasEvolution: true, version: '2.0.0', lastUpdated: '2025-07-20T08:00:00Z', owner: 'user-005' },
  { id: 'VC-005', name: 'Pagination', level: 'L1', category: '基础复合', description: '分页组件，支持页码跳转和每页条数设置', vibeStatus: 'approved', hasContract: true, hasRules: true, hasTests: true, hasEvolution: false, version: '1.5.0', lastUpdated: '2025-07-15T08:00:00Z', owner: 'user-004' },
  { id: 'VC-006', name: 'Dashboard', level: 'L4', category: '页面编排', description: '仪表盘页面，组合多个数据展示组件', vibeStatus: 'in_progress', hasContract: true, hasRules: false, hasTests: false, hasEvolution: false, version: '0.8.0', lastUpdated: '2025-08-10T08:00:00Z', owner: 'user-002' },
  { id: 'VC-007', name: 'UserCard', level: 'L2', category: '业务组件', description: '用户信息卡片，展示头像、姓名、角色', vibeStatus: 'defined', hasContract: false, hasRules: false, hasTests: false, hasEvolution: false, version: '0.1.0', lastUpdated: '2025-08-09T08:00:00Z', owner: 'user-003' },
  { id: 'VC-008', name: 'FileUploader', level: 'L2', category: '业务组件', description: '文件上传组件，支持拖拽和批量上传', vibeStatus: 'approved', hasContract: true, hasRules: true, hasTests: true, hasEvolution: true, version: '1.8.0', lastUpdated: '2025-08-03T08:00:00Z', owner: 'user-005' },
  { id: 'VC-009', name: 'StatusBadge', level: 'L1', category: '基础复合', description: '状态标签，支持多种状态和颜色映射', vibeStatus: 'approved', hasContract: true, hasRules: true, hasTests: true, hasEvolution: true, version: '1.3.0', lastUpdated: '2025-07-25T08:00:00Z', owner: 'user-004' },
  { id: 'VC-010', name: 'ChartPanel', level: 'L3', category: '数据组件', description: '图表面板，支持折线图、柱状图、饼图', vibeStatus: 'review', hasContract: true, hasRules: true, hasTests: false, hasEvolution: true, version: '2.0.0', lastUpdated: '2025-08-07T08:00:00Z', owner: 'user-005' },
];

// ============ Dashboard 统计 ============
export const dashboardStats: DashboardStats = {
  totalCases: 16,
  totalPlans: 5,
  totalDefects: 8,
  passRate: 92.4,
  defectTrend: [
    { date: '07-28', open: 3, resolved: 1 },
    { date: '07-29', open: 4, resolved: 1 },
    { date: '07-30', open: 3, resolved: 2 },
    { date: '07-31', open: 5, resolved: 1 },
    { date: '08-01', open: 4, resolved: 2 },
    { date: '08-02', open: 3, resolved: 1 },
    { date: '08-03', open: 4, resolved: 3 },
    { date: '08-04', open: 5, resolved: 2 },
    { date: '08-05', open: 4, resolved: 2 },
    { date: '08-06', open: 6, resolved: 3 },
    { date: '08-07', open: 5, resolved: 2 },
    { date: '08-08', open: 4, resolved: 3 },
    { date: '08-09', open: 5, resolved: 2 },
    { date: '08-10', open: 4, resolved: 1 },
  ],
  executionTrend: [
    { date: '08-04', passed: 8, failed: 2, blocked: 1 },
    { date: '08-05', passed: 12, failed: 1, blocked: 0 },
    { date: '08-06', passed: 6, failed: 3, blocked: 2 },
    { date: '08-07', passed: 10, failed: 1, blocked: 1 },
    { date: '08-08', passed: 15, failed: 2, blocked: 0 },
    { date: '08-09', passed: 9, failed: 1, blocked: 1 },
    { date: '08-10', passed: 11, failed: 2, blocked: 1 },
  ],
  moduleDistribution: [
    { module: '用户认证', count: 2 },
    { module: 'API 网关', count: 1 },
    { module: '数据管理', count: 3 },
    { module: 'UI 组件', count: 3 },
    { module: '安全模块', count: 3 },
    { module: '集成测试', count: 2 },
    { module: '性能优化', count: 1 },
    { module: '部署流水线', count: 1 },
  ],
  priorityDistribution: [
    { priority: 'P0', count: 4 },
    { priority: 'P1', count: 6 },
    { priority: 'P2', count: 4 },
    { priority: 'P3', count: 2 },
  ],
  recentActivities: [
    { id: 'ACT-001', type: 'execution_completed', title: '用例执行完成', description: 'TC-001 用户登录验证 - 通过', user: '王浩', timestamp: '2025-08-10T14:00:00Z' },
    { id: 'ACT-002', type: 'defect_reported', title: '新缺陷提交', description: 'DEF-001 API速率限制阈值不一致', user: '王浩', timestamp: '2025-08-10T11:30:00Z' },
    { id: 'ACT-003', type: 'plan_created', title: '测试计划创建', description: 'TP-004 契约引擎集成测试', user: '周丽', timestamp: '2025-08-10T08:00:00Z' },
    { id: 'ACT-004', type: 'case_updated', title: '用例更新', description: 'TC-006 安全沙箱文件隔离 - 步骤优化', user: '刘芳', timestamp: '2025-08-10T07:00:00Z' },
    { id: 'ACT-005', type: 'defect_resolved', title: '缺陷已解决', description: 'DEF-008 审计日志敏感信息脱敏', user: '刘芳', timestamp: '2025-08-09T16:00:00Z' },
    { id: 'ACT-006', type: 'case_created', title: '新用例创建', description: 'TC-016 缓存策略验证', user: '陈刚', timestamp: '2025-08-09T10:00:00Z' },
    { id: 'ACT-007', type: 'execution_completed', title: '用例执行完成', description: 'TC-003 API速率限制 - 失败', user: '王浩', timestamp: '2025-08-09T09:00:00Z' },
    { id: 'ACT-008', type: 'plan_completed', title: '测试计划完成', description: 'TP-002 用户认证安全测试 - 100%通过', user: '李薇', timestamp: '2025-08-08T16:00:00Z' },
  ],
};

// 辅助函数
export function getMemberName(id: string): string {
  return teamMembers.find(m => m.id === id)?.name ?? '未知';
}

export function getMemberById(id: string): TeamMember | undefined {
  return teamMembers.find(m => m.id === id);
}

export function getProjectById(id: string): Project | undefined {
  return projects.find(p => p.id === id);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${formatDate(dateStr)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
