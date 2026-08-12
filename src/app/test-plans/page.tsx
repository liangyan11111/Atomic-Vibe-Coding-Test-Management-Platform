'use client';

import { useState, useMemo } from 'react';
import {
  Plus, Search, Calendar, Users, FileText, CheckCircle2,
  XCircle, AlertTriangle, Clock, MoreHorizontal, Eye,
  Play, Pause, ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { testPlans, testCases, getMemberName, getProjectById, formatDate } from '@/lib/mock-data';
import { ModuleVibeEntry } from '@/components/vibe-workspace';
import type { TestPlan } from '@/lib/types';
import { cn } from '@/lib/utils';

function PlanStatusBadge({ status }: { status: TestPlan['status'] }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    planning: { label: '计划中', className: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Clock className="h-3 w-3" /> },
    in_progress: { label: '进行中', className: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: <Play className="h-3 w-3" /> },
    completed: { label: '已完成', className: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="h-3 w-3" /> },
    cancelled: { label: '已取消', className: 'bg-rose-50 text-rose-600 border-rose-200', icon: <Pause className="h-3 w-3" /> },
  };
  const c = config[status];
  return (
    <Badge variant="outline" className={cn('gap-1 text-[10px]', c.className)}>
      {c.icon}{c.label}
    </Badge>
  );
}

export default function TestPlansPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState<TestPlan | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredPlans = useMemo(() => {
    return testPlans.filter(plan => {
      if (search && !plan.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && plan.status !== statusFilter) return false;
      return true;
    });
  }, [search, statusFilter]);

  const statusCounts = useMemo(() => ({
    all: testPlans.length,
    planning: testPlans.filter(p => p.status === 'planning').length,
    in_progress: testPlans.filter(p => p.status === 'in_progress').length,
    completed: testPlans.filter(p => p.status === 'completed').length,
  }), []);

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">测试计划</h1>
          <p className="text-sm text-slate-500">创建和管理测试计划，跟踪测试进度与覆盖率</p>
        </div>
        <div className="flex items-center gap-2">
          <ModuleVibeEntry moduleName="测试计划" modulePath="/test-plans" />
          <Button size="sm" className="gap-1.5 bg-indigo-600 text-xs hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-3.5 w-3.5" />新建计划
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all', label: '全部', count: statusCounts.all },
          { key: 'in_progress', label: '进行中', count: statusCounts.in_progress },
          { key: 'planning', label: '计划中', count: statusCounts.planning },
          { key: 'completed', label: '已完成', count: statusCounts.completed },
        ].map(tab => (
          <Button
            key={tab.key}
            variant={statusFilter === tab.key ? 'default' : 'outline'}
            size="sm"
            className={cn(
              'text-xs gap-1.5',
              statusFilter === tab.key ? 'bg-indigo-600 hover:bg-indigo-700' : 'border-slate-200 text-slate-600',
            )}
            onClick={() => setStatusFilter(tab.key)}
          >
            {tab.label}
            <Badge variant="secondary" className="text-[10px] px-1.5">{tab.count}</Badge>
          </Button>
        ))}
        <div className="ml-auto">
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索计划..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-slate-200 bg-white pl-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-2 gap-4">
        {filteredPlans.map(plan => {
          const project = getProjectById(plan.projectId);
          const planCases = testCases.filter(tc => plan.testCaseIds.includes(tc.id));
          return (
            <Card
              key={plan.id}
              className="border-slate-200 bg-white transition-shadow hover:shadow-md cursor-pointer"
              onClick={() => setSelectedPlan(plan)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-slate-400">{plan.id}</span>
                      <PlanStatusBadge status={plan.status} />
                    </div>
                    <CardTitle className="text-sm font-semibold text-slate-800 leading-tight">{plan.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem><Eye className="mr-2 h-3.5 w-3.5" />查看</DropdownMenuItem>
                      <DropdownMenuItem><Play className="mr-2 h-3.5 w-3.5" />执行</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-rose-600">取消计划</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-xs line-clamp-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">执行进度</span>
                    <span className="font-medium text-slate-700">{plan.progress}%</span>
                  </div>
                  <Progress value={plan.progress} className="h-1.5" />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-slate-600">{plan.passCount} 通过</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5 text-rose-500" />
                    <span className="text-slate-600">{plan.failCount} 失败</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-slate-600">{plan.blockedCount} 阻塞</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-slate-600">{plan.pendingCount} 待执行</span>
                  </div>
                </div>

                {/* Footer info */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />{plan.testCaseIds.length} 用例
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />{formatDate(plan.startDate)} ~ {formatDate(plan.endDate)}
                    </span>
                  </div>
                  <div className="flex -space-x-1.5">
                    {plan.assignedTo.slice(0, 3).map(uid => (
                      <Avatar key={uid} className="h-5 w-5 border border-white">
                        <AvatarFallback className="bg-indigo-100 text-[8px] font-medium text-indigo-700">
                          {getMemberName(uid).slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      {selectedPlan && (
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{selectedPlan.id}</span>
                <PlanStatusBadge status={selectedPlan.status} />
              </div>
              <DialogTitle className="text-base">{selectedPlan.name}</DialogTitle>
              <DialogDescription>{selectedPlan.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-emerald-50 p-3 text-center">
                  <p className="text-lg font-bold text-emerald-700">{selectedPlan.passCount}</p>
                  <p className="text-[10px] text-emerald-600">通过</p>
                </div>
                <div className="rounded-lg bg-rose-50 p-3 text-center">
                  <p className="text-lg font-bold text-rose-700">{selectedPlan.failCount}</p>
                  <p className="text-[10px] text-rose-600">失败</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-3 text-center">
                  <p className="text-lg font-bold text-amber-700">{selectedPlan.blockedCount}</p>
                  <p className="text-[10px] text-amber-600">阻塞</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-500">包含用例</span>
                <div className="space-y-1.5">
                  {testCases.filter(tc => selectedPlan.testCaseIds.includes(tc.id)).map(tc => (
                    <div key={tc.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">{tc.id}</span>
                        <span className="text-sm text-slate-700">{tc.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{tc.priority}</Badge>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">创建人</span>
                  <p className="text-slate-700 font-medium">{getMemberName(selectedPlan.createdBy)}</p>
                </div>
                <div>
                  <span className="text-slate-500">所属项目</span>
                  <p className="text-slate-700 font-medium">{getProjectById(selectedPlan.projectId)?.name}</p>
                </div>
                <div>
                  <span className="text-slate-500">开始日期</span>
                  <p className="text-slate-700 font-medium">{formatDate(selectedPlan.startDate)}</p>
                </div>
                <div>
                  <span className="text-slate-500">结束日期</span>
                  <p className="text-slate-700 font-medium">{formatDate(selectedPlan.endDate)}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedPlan(null)}>关闭</Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">执行测试</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建测试计划</DialogTitle>
            <DialogDescription>创建测试计划，选择要执行的测试用例</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">计划名称</Label>
              <Input placeholder="输入计划名称" className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">计划描述</Label>
              <Textarea placeholder="描述测试计划的目标和范围" className="text-sm min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">开始日期</Label>
                <Input type="date" className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">结束日期</Label>
                <Input type="date" className="text-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">选择用例</Label>
              <div className="rounded-lg border border-slate-200 p-2 max-h-[120px] overflow-y-auto space-y-1">
                {testCases.slice(0, 6).map(tc => (
                  <label key={tc.id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-slate-50 cursor-pointer">
                    <Checkbox />
                    <span className="font-mono text-[10px] text-slate-400">{tc.id}</span>
                    <span className="text-xs text-slate-700 truncate">{tc.title}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(false)}>创建计划</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
