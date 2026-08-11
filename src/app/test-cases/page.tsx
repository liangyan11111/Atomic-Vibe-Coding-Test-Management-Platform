'use client';

import { useState, useMemo } from 'react';
import {
  Search, Filter, Plus, MoreHorizontal, ChevronDown,
  FileText, CheckCircle2, XCircle, Clock, AlertCircle, Tag,
  ArrowUpDown, Eye, Edit, Copy, Trash2, Download, Upload,
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
import { testCases, getMemberName, getProjectById } from '@/lib/mock-data';
import type { TestCase } from '@/lib/types';
import { cn } from '@/lib/utils';

function PriorityBadge({ priority }: { priority: TestCase['priority'] }) {
  const styles: Record<string, string> = {
    P0: 'bg-rose-100 text-rose-700 border-rose-200',
    P1: 'bg-amber-100 text-amber-700 border-amber-200',
    P2: 'bg-sky-100 text-sky-700 border-sky-200',
    P3: 'bg-slate-100 text-slate-600 border-slate-200',
  };
  return (
    <Badge variant="outline" className={cn('text-[10px] font-bold px-1.5', styles[priority])}>
      {priority}
    </Badge>
  );
}

function StatusBadge({ status }: { status: TestCase['status'] }) {
  const config: Record<string, { label: string; className: string }> = {
    active: { label: '启用', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    draft: { label: '草稿', className: 'bg-slate-50 text-slate-600 border-slate-200' },
    deprecated: { label: '废弃', className: 'bg-rose-50 text-rose-600 border-rose-200' },
  };
  const c = config[status];
  return <Badge variant="outline" className={cn('text-[10px]', c.className)}>{c.label}</Badge>;
}

function TypeBadge({ type }: { type: TestCase['type'] }) {
  const config: Record<string, { label: string; icon: React.ReactNode }> = {
    functional: { label: '功能', icon: <CheckCircle2 className="h-3 w-3" /> },
    performance: { label: '性能', icon: <ArrowUpDown className="h-3 w-3" /> },
    security: { label: '安全', icon: <AlertCircle className="h-3 w-3" /> },
    compatibility: { label: '兼容', icon: <Eye className="h-3 w-3" /> },
    usability: { label: '易用', icon: <FileText className="h-3 w-3" /> },
  };
  const c = config[type];
  return (
    <Badge variant="outline" className="gap-1 text-[10px] text-slate-600">
      {c.icon}{c.label}
    </Badge>
  );
}

export default function TestCasesPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [detailCase, setDetailCase] = useState<TestCase | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const modules = useMemo(() => [...new Set(testCases.map(tc => tc.module))], []);

  const filteredCases = useMemo(() => {
    return testCases.filter(tc => {
      if (search && !tc.title.toLowerCase().includes(search.toLowerCase()) && !tc.id.toLowerCase().includes(search.toLowerCase())) return false;
      if (moduleFilter !== 'all' && tc.module !== moduleFilter) return false;
      if (priorityFilter !== 'all' && tc.priority !== priorityFilter) return false;
      if (statusFilter !== 'all' && tc.status !== statusFilter) return false;
      return true;
    });
  }, [search, moduleFilter, priorityFilter, statusFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredCases.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCases.map(tc => tc.id)));
    }
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">用例管理</h1>
          <p className="text-sm text-slate-500">管理所有测试用例，支持分类、筛选和批量操作</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Upload className="h-3.5 w-3.5" />导入
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="h-3.5 w-3.5" />导出
          </Button>
          <Button size="sm" className="gap-1.5 bg-indigo-600 text-xs hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-3.5 w-3.5" />新建用例
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索用例 ID 或标题..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-slate-200 bg-slate-50 pl-8 text-sm"
            />
          </div>
          <Select value={moduleFilter} onValueChange={setModuleFilter}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="模块" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部模块</SelectItem>
              {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue placeholder="优先级" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部优先级</SelectItem>
              <SelectItem value="P0">P0 阻塞</SelectItem>
              <SelectItem value="P1">P1 严重</SelectItem>
              <SelectItem value="P2">P2 一般</SelectItem>
              <SelectItem value="P3">P3 轻微</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">启用</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="deprecated">废弃</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex items-center gap-2">
            {selectedIds.size > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                已选 {selectedIds.size} 项
              </Badge>
            )}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'grid')}>
              <TabsList className="h-8">
                <TabsTrigger value="list" className="text-xs px-2.5">列表</TabsTrigger>
                <TabsTrigger value="grid" className="text-xs px-2.5">卡片</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="w-10 px-4 py-3">
                    <Checkbox checked={selectedIds.size === filteredCases.length && filteredCases.length > 0} onCheckedChange={toggleAll} />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">标题</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">模块</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">优先级</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">类型</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">状态</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">通过率</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-slate-500">负责人</th>
                  <th className="w-10 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((tc) => (
                  <tr
                    key={tc.id}
                    className={cn(
                      'border-b border-slate-50 transition-colors hover:bg-slate-50/50',
                      selectedIds.has(tc.id) && 'bg-indigo-50/30',
                    )}
                  >
                    <td className="px-4 py-3">
                      <Checkbox checked={selectedIds.has(tc.id)} onCheckedChange={() => toggleSelect(tc.id)} />
                    </td>
                    <td className="px-3 py-3">
                      <span className="font-mono text-xs text-slate-500">{tc.id}</span>
                    </td>
                    <td className="px-3 py-3">
                      <button
                        className="text-left text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors max-w-[280px] truncate block"
                        onClick={() => setDetailCase(tc)}
                      >
                        {tc.title}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-600">{tc.module}</span>
                    </td>
                    <td className="px-3 py-3">
                      <PriorityBadge priority={tc.priority} />
                    </td>
                    <td className="px-3 py-3">
                      <TypeBadge type={tc.type} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={tc.status} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-16 rounded-full bg-slate-100">
                          <div
                            className={cn(
                              'h-1.5 rounded-full',
                              tc.passRate >= 90 ? 'bg-emerald-500' : tc.passRate >= 70 ? 'bg-amber-500' : 'bg-rose-500',
                            )}
                            style={{ width: `${tc.passRate}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500">{tc.passRate}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-slate-600">{getMemberName(tc.assignedTo)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem onClick={() => setDetailCase(tc)}>
                            <Eye className="mr-2 h-3.5 w-3.5" />查看详情
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-3.5 w-3.5" />编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-3.5 w-3.5" />复制
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-rose-600">
                            <Trash2 className="mr-2 h-3.5 w-3.5" />删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-xs text-slate-500">共 {filteredCases.length} 条用例</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs">上一页</Button>
              <Button variant="outline" size="sm" className="h-7 w-7 text-xs p-0">1</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">下一页</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      {detailCase && (
        <Dialog open={!!detailCase} onOpenChange={() => setDetailCase(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{detailCase.id}</span>
                <PriorityBadge priority={detailCase.priority} />
                <StatusBadge status={detailCase.status} />
              </div>
              <DialogTitle className="text-base">{detailCase.title}</DialogTitle>
              <DialogDescription className="text-sm">{detailCase.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">所属项目</span>
                  <p className="text-sm text-slate-700">{getProjectById(detailCase.projectId)?.name}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">所属模块</span>
                  <p className="text-sm text-slate-700">{detailCase.module}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">负责人</span>
                  <p className="text-sm text-slate-700">{getMemberName(detailCase.assignedTo)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500">执行次数</span>
                  <p className="text-sm text-slate-700">{detailCase.executionCount} 次 (通过率 {detailCase.passRate}%)</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500">前置条件</span>
                <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3">{detailCase.precondition}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-500">测试步骤</span>
                <div className="space-y-2">
                  {detailCase.steps.map((step) => (
                    <div key={step.order} className="flex gap-3 bg-slate-50 rounded-lg p-3">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-700">
                        {step.order}
                      </span>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-slate-700">{step.action}</p>
                        <p className="text-xs text-slate-500">预期: {step.expected}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500">预期结果</span>
                <p className="text-sm text-slate-700 bg-emerald-50 rounded-lg p-3 text-emerald-800">{detailCase.expectedResult}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {detailCase.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1 text-[10px]">
                    <Tag className="h-2.5 w-2.5" />{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setDetailCase(null)}>关闭</Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">编辑用例</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建测试用例</DialogTitle>
            <DialogDescription>创建一个新的测试用例，填写基本信息和测试步骤</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">用例标题</Label>
              <Input placeholder="输入用例标题" className="text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs">所属模块</Label>
                <Select>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="选择模块" /></SelectTrigger>
                  <SelectContent>
                    {modules.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">优先级</Label>
                <Select>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="选择优先级" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="P0">P0 阻塞</SelectItem>
                    <SelectItem value="P1">P1 严重</SelectItem>
                    <SelectItem value="P2">P2 一般</SelectItem>
                    <SelectItem value="P3">P3 轻微</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">用例描述</Label>
              <Textarea placeholder="描述测试用例的目的和范围" className="text-sm min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">前置条件</Label>
              <Textarea placeholder="执行此用例前需要满足的条件" className="text-sm min-h-[60px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(false)}>创建用例</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
