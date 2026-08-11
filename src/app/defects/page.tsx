'use client';

import { useState, useMemo } from 'react';
import {
  Search, Plus, Bug, AlertTriangle, AlertCircle, Info,
  MoreHorizontal, Eye, Edit, Link2, Clock, CheckCircle2,
  XCircle, ArrowRight, Filter,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defects, getMemberName, getProjectById, formatDate } from '@/lib/mock-data';
import type { Defect } from '@/lib/types';
import { cn } from '@/lib/utils';

function SeverityBadge({ severity }: { severity: Defect['severity'] }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    critical: { label: '致命', className: 'bg-rose-100 text-rose-700 border-rose-200', icon: <AlertCircle className="h-3 w-3" /> },
    major: { label: '严重', className: 'bg-orange-100 text-orange-700 border-orange-200', icon: <AlertTriangle className="h-3 w-3" /> },
    minor: { label: '一般', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Info className="h-3 w-3" /> },
    trivial: { label: '轻微', className: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Info className="h-3 w-3" /> },
  };
  const c = config[severity];
  return <Badge variant="outline" className={cn('gap-1 text-[10px]', c.className)}>{c.icon}{c.label}</Badge>;
}

function DefectStatusBadge({ status }: { status: Defect['status'] }) {
  const config: Record<string, { label: string; className: string }> = {
    open: { label: '待处理', className: 'bg-rose-50 text-rose-700 border-rose-200' },
    confirmed: { label: '已确认', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    in_progress: { label: '修复中', className: 'bg-sky-50 text-sky-700 border-sky-200' },
    resolved: { label: '已解决', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    closed: { label: '已关闭', className: 'bg-slate-100 text-slate-600 border-slate-200' },
    rejected: { label: '已拒绝', className: 'bg-slate-50 text-slate-500 border-slate-200' },
  };
  const c = config[status];
  return <Badge variant="outline" className={cn('text-[10px]', c.className)}>{c.label}</Badge>;
}

export default function DefectsPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const filteredDefects = useMemo(() => {
    return defects.filter(d => {
      if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (severityFilter !== 'all' && d.severity !== severityFilter) return false;
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      return true;
    });
  }, [search, severityFilter, statusFilter]);

  const boardColumns = useMemo(() => ({
    open: filteredDefects.filter(d => ['open', 'confirmed'].includes(d.status)),
    in_progress: filteredDefects.filter(d => d.status === 'in_progress'),
    resolved: filteredDefects.filter(d => ['resolved', 'closed'].includes(d.status)),
    rejected: filteredDefects.filter(d => d.status === 'rejected'),
  }), [filteredDefects]);

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">缺陷管理</h1>
          <p className="text-sm text-slate-500">跟踪和管理所有缺陷，确保问题得到及时解决</p>
        </div>
        <Button size="sm" className="gap-1.5 bg-indigo-600 text-xs hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-3.5 w-3.5" />提交缺陷
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '待处理', count: defects.filter(d => ['open', 'confirmed'].includes(d.status)).length, color: 'text-rose-600 bg-rose-50', icon: AlertCircle },
          { label: '修复中', count: defects.filter(d => d.status === 'in_progress').length, color: 'text-sky-600 bg-sky-50', icon: Clock },
          { label: '已解决', count: defects.filter(d => ['resolved', 'closed'].includes(d.status)).length, color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
          { label: '已拒绝', count: defects.filter(d => d.status === 'rejected').length, color: 'text-slate-600 bg-slate-50', icon: XCircle },
        ].map(item => (
          <Card key={item.label} className="border-slate-200 bg-white">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{item.count}</p>
                <p className="text-[11px] text-slate-500">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索缺陷 ID 或标题..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-slate-200 bg-slate-50 pl-8 text-sm"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="严重程度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部程度</SelectItem>
              <SelectItem value="critical">致命</SelectItem>
              <SelectItem value="major">严重</SelectItem>
              <SelectItem value="minor">一般</SelectItem>
              <SelectItem value="trivial">轻微</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="open">待处理</SelectItem>
              <SelectItem value="confirmed">已确认</SelectItem>
              <SelectItem value="in_progress">修复中</SelectItem>
              <SelectItem value="resolved">已解决</SelectItem>
              <SelectItem value="closed">已关闭</SelectItem>
              <SelectItem value="rejected">已拒绝</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'board')}>
              <TabsList className="h-8">
                <TabsTrigger value="list" className="text-xs px-2.5">列表</TabsTrigger>
                <TabsTrigger value="board" className="text-xs px-2.5">看板</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {viewMode === 'list' ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">标题</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">严重程度</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">状态</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">报告人</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">负责人</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">项目</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">创建时间</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredDefects.map(defect => (
                  <tr
                    key={defect.id}
                    className="border-b border-slate-50 transition-colors hover:bg-slate-50/50 cursor-pointer"
                    onClick={() => setSelectedDefect(defect)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{defect.id}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 max-w-[240px] truncate">{defect.title}</span>
                        {defect.relatedTestCaseId && (
                          <Badge variant="outline" className="text-[9px] gap-0.5 shrink-0">
                            <Link2 className="h-2.5 w-2.5" />{defect.relatedTestCaseId}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3"><SeverityBadge severity={defect.severity} /></td>
                    <td className="px-3 py-3"><DefectStatusBadge status={defect.status} /></td>
                    <td className="px-3 py-3 text-xs text-slate-600">{getMemberName(defect.reportedBy)}</td>
                    <td className="px-3 py-3 text-xs text-slate-600">{getMemberName(defect.assignedTo)}</td>
                    <td className="px-3 py-3 text-xs text-slate-600">{getProjectById(defect.projectId)?.name}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{formatDate(defect.createdAt)}</td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => setSelectedDefect(defect)}>
                            <Eye className="mr-2 h-3.5 w-3.5" />查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-3.5 w-3.5" />编辑</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-emerald-600">
                            <CheckCircle2 className="mr-2 h-3.5 w-3.5" />标记解决
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {[
            { key: 'open', label: '待处理', items: boardColumns.open, color: 'border-rose-200 bg-rose-50' },
            { key: 'in_progress', label: '修复中', items: boardColumns.in_progress, color: 'border-sky-200 bg-sky-50' },
            { key: 'resolved', label: '已解决', items: boardColumns.resolved, color: 'border-emerald-200 bg-emerald-50' },
            { key: 'rejected', label: '已拒绝', items: boardColumns.rejected, color: 'border-slate-200 bg-slate-50' },
          ].map(col => (
            <div key={col.key} className="space-y-2">
              <div className={cn('rounded-t-lg border-t-2 px-3 py-2', col.color)}>
                <span className="text-xs font-semibold text-slate-700">{col.label}</span>
                <Badge variant="secondary" className="ml-2 text-[10px]">{col.items.length}</Badge>
              </div>
              <div className="space-y-2">
                {col.items.map(defect => (
                  <Card
                    key={defect.id}
                    className="border-slate-200 bg-white cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedDefect(defect)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] text-slate-400">{defect.id}</span>
                        <SeverityBadge severity={defect.severity} />
                      </div>
                      <p className="text-xs font-medium text-slate-700 line-clamp-2">{defect.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>{getMemberName(defect.assignedTo)}</span>
                        <span>{formatDate(defect.createdAt)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      {selectedDefect && (
        <Dialog open={!!selectedDefect} onOpenChange={() => setSelectedDefect(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{selectedDefect.id}</span>
                <SeverityBadge severity={selectedDefect.severity} />
                <DefectStatusBadge status={selectedDefect.status} />
              </div>
              <DialogTitle className="text-base">{selectedDefect.title}</DialogTitle>
              <DialogDescription>{selectedDefect.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">所属项目</span>
                  <p className="text-sm text-slate-700">{getProjectById(selectedDefect.projectId)?.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">环境</span>
                  <p className="text-sm text-slate-700">{selectedDefect.environment}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">报告人</span>
                  <p className="text-sm text-slate-700">{getMemberName(selectedDefect.reportedBy)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">负责人</span>
                  <p className="text-sm text-slate-700">{getMemberName(selectedDefect.assignedTo)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">复现步骤</span>
                  <pre className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 whitespace-pre-wrap">{selectedDefect.stepsToReproduce}</pre>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">预期行为</span>
                    <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg p-3">{selectedDefect.expectedBehavior}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500">实际行为</span>
                    <p className="text-sm text-rose-700 bg-rose-50 rounded-lg p-3">{selectedDefect.actualBehavior}</p>
                  </div>
                </div>
              </div>

              {selectedDefect.relatedTestCaseId && (
                <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                  <Link2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span className="text-xs text-indigo-700">关联用例: {selectedDefect.relatedTestCaseId}</span>
                  {selectedDefect.relatedTestPlanId && (
                    <>
                      <ArrowRight className="h-3 w-3 text-indigo-400" />
                      <span className="text-xs text-indigo-600">计划: {selectedDefect.relatedTestPlanId}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedDefect(null)}>关闭</Button>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">标记解决</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>提交缺陷</DialogTitle>
            <DialogDescription>记录发现的缺陷，分配给相关开发人员</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">缺陷标题</Label>
              <Input placeholder="简要描述缺陷" className="text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">严重程度</Label>
                <Select>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="选择严重程度" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">致命</SelectItem>
                    <SelectItem value="major">严重</SelectItem>
                    <SelectItem value="minor">一般</SelectItem>
                    <SelectItem value="trivial">轻微</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">优先级</Label>
                <Select>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="选择优先级" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">紧急</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="low">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">复现步骤</Label>
              <Textarea placeholder="详细描述如何复现此缺陷" className="text-sm min-h-[80px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">预期行为</Label>
                <Textarea placeholder="期望的正确行为" className="text-sm min-h-[60px]" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">实际行为</Label>
                <Textarea placeholder="实际观察到的行为" className="text-sm min-h-[60px]" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(false)}>提交缺陷</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
