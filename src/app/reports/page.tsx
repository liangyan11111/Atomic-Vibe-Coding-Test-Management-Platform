'use client';

import { useState } from 'react';
import {
  FileText, Download, Calendar, User, TrendingUp,
  CheckCircle2, XCircle, AlertTriangle, Minus, Eye,
  BarChart3, PieChart as PieChartIcon,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { testReports, testPlans, testCases, defects, getMemberName, getProjectById, formatDate } from '@/lib/mock-data';
import type { TestReport } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#10B981', '#F43F5E', '#F59E0B', '#94A3B8'];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<TestReport | null>(null);

  // Aggregate data for overview
  const totalExecutions = testCases.reduce((s, tc) => s + tc.executionCount, 0);
  const avgPassRate = testCases.length > 0
    ? (testCases.reduce((s, tc) => s + tc.passRate, 0) / testCases.length).toFixed(1)
    : '0';
  const openDefects = defects.filter(d => ['open', 'confirmed', 'in_progress'].includes(d.status)).length;
  const resolvedDefects = defects.filter(d => ['resolved', 'closed'].includes(d.status)).length;

  const defectBySeverity = [
    { name: '致命', value: defects.filter(d => d.severity === 'critical').length, color: '#F43F5E' },
    { name: '严重', value: defects.filter(d => d.severity === 'major').length, color: '#F97316' },
    { name: '一般', value: defects.filter(d => d.severity === 'minor').length, color: '#F59E0B' },
    { name: '轻微', value: defects.filter(d => d.severity === 'trivial').length, color: '#94A3B8' },
  ].filter(d => d.value > 0);

  const projectStats = [
    { name: 'Vibe Studio', cases: testCases.filter(tc => tc.projectId === 'proj-001').length, defects: defects.filter(d => d.projectId === 'proj-001').length },
    { name: 'Guard Layer', cases: testCases.filter(tc => tc.projectId === 'proj-002').length, defects: defects.filter(d => d.projectId === 'proj-002').length },
    { name: 'Contract Engine', cases: testCases.filter(tc => tc.projectId === 'proj-003').length, defects: defects.filter(d => d.projectId === 'proj-003').length },
    { name: 'Component Portal', cases: testCases.filter(tc => tc.projectId === 'proj-004').length, defects: defects.filter(d => d.projectId === 'proj-004').length },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">测试报告</h1>
          <p className="text-sm text-slate-500">查看测试统计分析和质量趋势</p>
        </div>
        <Button size="sm" className="gap-1.5 bg-indigo-600 text-xs hover:bg-indigo-700">
          <FileText className="h-3.5 w-3.5" />生成报告
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{totalExecutions}</p>
              <p className="text-[11px] text-slate-500">总执行次数</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{avgPassRate}%</p>
              <p className="text-[11px] text-slate-500">平均通过率</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{openDefects}</p>
              <p className="text-[11px] text-slate-500">未解决缺陷</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{resolvedDefects}</p>
              <p className="text-[11px] text-slate-500">已解决缺陷</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">项目用例与缺陷对比</CardTitle>
            <CardDescription className="text-xs">各项目测试用例数和缺陷数</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={projectStats} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                <Bar dataKey="cases" fill="#4F46E5" radius={[4, 4, 0, 0]} name="用例数" />
                <Bar dataKey="defects" fill="#F43F5E" radius={[4, 4, 0, 0]} name="缺陷数" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-700">缺陷严重程度分布</CardTitle>
            <CardDescription className="text-xs">按严重程度统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie
                    data={defectBySeverity}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {defectBySeverity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {defectBySeverity.map(item => (
                  <div key={item.name} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-600">{item.name}</span>
                    <span className="text-xs font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report History */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-slate-700">历史报告</CardTitle>
          <CardDescription className="text-xs">已生成的测试报告列表</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {testReports.map(report => {
              const plan = testPlans.find(p => p.id === report.testPlanId);
              return (
                <div
                  key={report.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-4 transition-colors hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      <FileText className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{report.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(report.generatedAt)}</span>
                        <span className="flex items-center gap-1"><User className="h-3 w-3" />{getMemberName(report.generatedBy)}</span>
                        {plan && <span>计划: {plan.name}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" />{report.passed}</span>
                      <span className="flex items-center gap-1 text-rose-600"><XCircle className="h-3.5 w-3.5" />{report.failed}</span>
                      <span className="flex items-center gap-1 text-amber-600"><AlertTriangle className="h-3.5 w-3.5" />{report.blocked}</span>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-lg font-bold', report.passRate >= 90 ? 'text-emerald-600' : report.passRate >= 70 ? 'text-amber-600' : 'text-rose-600')}>
                        {report.passRate}%
                      </p>
                      <p className="text-[10px] text-slate-400">通过率</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {testReports.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <FileText className="h-10 w-10 mb-2" />
                <p className="text-sm">暂无测试报告</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">{selectedReport.title}</DialogTitle>
              <DialogDescription>{selectedReport.summary}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-lg bg-indigo-50 p-3 text-center">
                  <p className="text-lg font-bold text-indigo-700">{selectedReport.totalCases}</p>
                  <p className="text-[10px] text-indigo-600">总用例</p>
                </div>
                <div className="rounded-lg bg-emerald-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-700">{selectedReport.passed}</p>
                  <p className="text-[10px] text-emerald-600">通过</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-3 text-center">
                  <p className="text-lg font-bold text-rose-700">{selectedReport.failed}</p>
                  <p className="text-[10px] text-rose-600">失败</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">{selectedReport.blocked}</p>
                  <p className="text-[10px] text-amber-600">阻塞</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">通过率</span>
                  <span className="font-bold text-slate-700">{selectedReport.passRate}%</span>
                </div>
                <Progress value={selectedReport.passRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">覆盖率</span>
                  <span className="font-bold text-slate-700">{selectedReport.coverageRate}%</span>
                </div>
                <Progress value={selectedReport.coverageRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">生成时间</span>
                  <p className="text-slate-700 font-medium">{formatDate(selectedReport.generatedAt)}</p>
                </div>
                <div>
                  <span className="text-slate-500">生成人</span>
                  <p className="text-slate-700 font-medium">{getMemberName(selectedReport.generatedBy)}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>关闭</Button>
              <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700">
                <Download className="h-3.5 w-3.5" />下载报告
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
