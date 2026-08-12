/**
 * Query Handler - 获取仪表盘统计数据
 */

import { withTrace } from '@/guard';
import { testCases, defects, testPlans } from '@/lib/mock-data';

export interface DashboardStats {
  totalCases: number;
  totalDefects: number;
  totalPlans: number;
  passRate: number;
  defectTrend: Array<{ date: string; count: number }>;
  moduleDistribution: Array<{ name: string; value: number }>;
  recentActivities: Array<{ id: string; type: string; title: string; time: string; user: string }>;
}

export async function handleGetDashboardStats(traceId?: string): Promise<DashboardStats> {
  return withTrace('GetDashboardStatsQuery', async () => {
    const totalCases = testCases.length;
    const totalDefects = defects.length;
    const totalPlans = testPlans.length;

    // 计算通过率
    const executedCases = testCases.filter((tc) => tc.executionCount > 0);
    const avgPassRate = executedCases.length > 0
      ? Math.round(executedCases.reduce((sum, tc) => sum + tc.passRate, 0) / executedCases.length)
      : 0;

    // 模块分布
    const moduleMap = new Map<string, number>();
    testCases.forEach((tc) => {
      moduleMap.set(tc.module, (moduleMap.get(tc.module) || 0) + 1);
    });
    const moduleDistribution = Array.from(moduleMap.entries()).map(([name, value]) => ({ name, value }));

    // 缺陷趋势（模拟）
    const defectTrend = Array.from({ length: 7 }, (_, i) => ({
      date: `${i + 1}日`,
      count: Math.floor(Math.random() * 10) + 1,
    }));

    // 近期活动
    const recentActivities = [
      { id: '1', type: 'test_case', title: '创建了用例 "用户登录流程测试"', time: '10 分钟前', user: '张三' },
      { id: '2', type: 'defect', title: '提交了缺陷 "支付接口超时"', time: '30 分钟前', user: '李四' },
      { id: '3', type: 'test_plan', title: '完成了计划 "Sprint 23 回归测试"', time: '1 小时前', user: '王五' },
      { id: '4', type: 'test_case', title: '执行了用例 "订单创建接口测试"', time: '2 小时前', user: '赵六' },
      { id: '5', type: 'defect', title: '关闭了缺陷 "页面样式错位"', time: '3 小时前', user: '张三' },
    ];

    return {
      totalCases,
      totalDefects,
      totalPlans,
      passRate: avgPassRate,
      defectTrend,
      moduleDistribution,
      recentActivities,
    };
  }, traceId);
}
