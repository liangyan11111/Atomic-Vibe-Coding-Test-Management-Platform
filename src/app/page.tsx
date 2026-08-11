'use client';

import { useState } from 'react';
import {
  FileText, ClipboardList, Bug, TrendingUp,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Clock, AlertTriangle,
  Zap, Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { dashboardStats, getMemberName } from '@/lib/mock-data';
import type { Activity } from '@/lib/types';
import { ExecutionTrendChart, DefectTrendChart, ModuleDistributionChart } from '@/components/charts/dashboard-charts';

function StatCard({ title, value, change, changeType, icon: Icon, iconColor }: {
  title: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}) {
  return (
    <Card className="border-slate-200 bg-white">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColor}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {changeType === 'up' && <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />}
          {changeType === 'down' && <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />}
          <span className={`text-xs font-medium ${changeType === 'up' ? 'text-emerald-600' : changeType === 'down' ? 'text-rose-600' : 'text-slate-500'}`}>
            {change}
          </span>
          <span className="text-xs text-slate-400">较上周</span>
        </div>
      </CardContent>
    </Card>
  );
}

function getActivityIcon(type: Activity['type']) {
  switch (type) {
    case 'case_created': return <Plus className="h-3.5 w-3.5 text-indigo-500" />;
    case 'case_updated': return <FileText className="h-3.5 w-3.5 text-sky-500" />;
    case 'plan_created': return <ClipboardList className="h-3.5 w-3.5 text-violet-500" />;
    case 'plan_completed': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    case 'defect_reported': return <Bug className="h-3.5 w-3.5 text-rose-500" />;
    case 'defect_resolved': return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    case 'execution_completed': return <Zap className="h-3.5 w-3.5 text-amber-500" />;
    default: return <Clock className="h-3.5 w-3.5 text-slate-400" />;
  }
}

function getActivityColor(type: Activity['type']): string {
  switch (type) {
    case 'case_created': return 'bg-indigo-50';
    case 'case_updated': return 'bg-sky-50';
    case 'plan_created': return 'bg-violet-50';
    case 'plan_completed': return 'bg-emerald-50';
    case 'defect_reported': return 'bg-rose-50';
    case 'defect_resolved': return 'bg-emerald-50';
    case 'execution_completed': return 'bg-amber-50';
    default: return 'bg-slate-50';
  }
}

function timeAgo(timestamp: string): string {
  const now = new Date('2025-08-10T16:00:00Z');
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  return `${diffDays} 天前`;
}

export default function DashboardPage() {
  const [chartPeriod] = useState<'7d' | '14d'>('7d');

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">测试概览</h1>
          <p className="text-sm text-slate-500">实时掌握项目质量状态与测试进度</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 border-emerald-200 text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            系统正常
          </Badge>
          <span className="text-xs text-slate-400">最后更新: 2 分钟前</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="测试用例"
          value={dashboardStats.totalCases}
          change="+3"
          changeType="up"
          icon={FileText}
          iconColor="bg-indigo-500"
        />
        <StatCard
          title="测试计划"
          value={dashboardStats.totalPlans}
          change="+1"
          changeType="up"
          icon={ClipboardList}
          iconColor="bg-violet-500"
        />
        <StatCard
          title="活跃缺陷"
          value={dashboardStats.totalDefects}
          change="-2"
          changeType="down"
          icon={Bug}
          iconColor="bg-rose-500"
        />
        <StatCard
          title="通过率"
          value={`${dashboardStats.passRate}%`}
          change="+1.2%"
          changeType="up"
          icon={TrendingUp}
          iconColor="bg-emerald-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-700">执行趋势</CardTitle>
                <CardDescription className="text-xs">最近 {chartPeriod === '7d' ? '7' : '14'} 天测试执行情况</CardDescription>
              </div>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />通过</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" />失败</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" />阻塞</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ExecutionTrendChart data={dashboardStats.executionTrend.slice(-7)} />
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">模块分布</CardTitle>
            <CardDescription className="text-xs">用例按模块分布</CardDescription>
          </CardHeader>
          <CardContent>
            <ModuleDistributionChart data={dashboardStats.moduleDistribution} />
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-700">缺陷趋势</CardTitle>
                <CardDescription className="text-xs">新增 vs 解决</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <DefectTrendChart data={dashboardStats.defectTrend.slice(-7)} />
          </CardContent>
        </Card>

        {/* Active Plans */}
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">进行中的计划</CardTitle>
            <CardDescription className="text-xs">当前活跃测试计划</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'v2.5.0 回归测试', progress: 67, status: 'in_progress' as const, total: 6, done: 4 },
              { name: '安全沙箱 v1.2 验收', progress: 45, status: 'in_progress' as const, total: 3, done: 1 },
            ].map((plan) => (
              <div key={plan.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{plan.name}</span>
                  <Badge variant={plan.status === 'in_progress' ? 'default' : 'secondary'} className="text-[10px]">
                    {plan.status === 'in_progress' ? '进行中' : '计划中'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={plan.progress} className="h-1.5" />
                  <span className="text-xs font-medium text-slate-500">{plan.progress}%</span>
                </div>
                <div className="flex gap-3 text-[11px] text-slate-400">
                  <span>{plan.done}/{plan.total} 已完成</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Priority Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2 border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">最近动态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {dashboardStats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{activity.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{activity.description}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[11px] text-slate-400">{timeAgo(activity.timestamp)}</span>
                    <span className="text-[11px] text-slate-500">{activity.user}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Status */}
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">优先级分布</CardTitle>
            <CardDescription className="text-xs">用例按优先级统计</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboardStats.priorityDistribution.map((item) => {
              const colors: Record<string, string> = {
                P0: 'bg-rose-500', P1: 'bg-amber-500', P2: 'bg-sky-500', P3: 'bg-slate-400',
              };
              const bgColors: Record<string, string> = {
                P0: 'bg-rose-50', P1: 'bg-amber-50', P2: 'bg-sky-50', P3: 'bg-slate-50',
              };
              const total = dashboardStats.priorityDistribution.reduce((s, i) => s + i.count, 0);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.priority} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex h-5 w-8 items-center justify-center rounded text-[10px] font-bold text-white ${colors[item.priority]}`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-slate-600">
                        {item.priority === 'P0' ? '阻塞级' : item.priority === 'P1' ? '严重' : item.priority === 'P2' ? '一般' : '轻微'}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-700">{item.count} 条</span>
                  </div>
                  <div className={`h-1.5 w-full rounded-full ${bgColors[item.priority]}`}>
                    <div className={`h-1.5 rounded-full ${colors[item.priority]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs font-medium text-slate-700">需要关注</span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-500">
                <li>2 个 P0 缺陷未解决</li>
                <li>1 个测试计划进度滞后</li>
                <li>3 个用例超过 30 天未执行</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
