'use client';

import { useState, useMemo } from 'react';
import {
  Search, Blocks, CheckCircle2, Clock, Eye, FileText,
  Shield, GitBranch, Sparkles, Filter, ChevronRight,
  BookOpen, Code2, FileCheck, History,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { vibeComponents, getMemberName } from '@/lib/mock-data';
import type { VibeComponent } from '@/lib/types';
import { cn } from '@/lib/utils';

function LevelBadge({ level }: { level: VibeComponent['level'] }) {
  const config: Record<string, { className: string; desc: string }> = {
    L0: { className: 'bg-slate-100 text-slate-700 border-slate-200', desc: '原子组件' },
    L1: { className: 'bg-sky-100 text-sky-700 border-sky-200', desc: '基础复合' },
    L2: { className: 'bg-indigo-100 text-indigo-700 border-indigo-200', desc: '业务组件' },
    L3: { className: 'bg-violet-100 text-violet-700 border-violet-200', desc: '数据组件' },
    L4: { className: 'bg-rose-100 text-rose-700 border-rose-200', desc: '页面编排' },
  };
  const c = config[level];
  return (
    <Badge variant="outline" className={cn('text-[10px] font-bold', c.className)}>
      {level}
    </Badge>
  );
}

function VibeStatusBadge({ status }: { status: VibeComponent['vibeStatus'] }) {
  const config: Record<string, { label: string; className: string }> = {
    defined: { label: '已定义', className: 'bg-slate-50 text-slate-600 border-slate-200' },
    in_progress: { label: '进行中', className: 'bg-sky-50 text-sky-700 border-sky-200' },
    review: { label: '审核中', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    approved: { label: '已通过', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  };
  const c = config[status];
  return <Badge variant="outline" className={cn('text-[10px]', c.className)}>{c.label}</Badge>;
}

function CompletenessCheck({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {done ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-200" />
      )}
      <span className={cn('text-[11px]', done ? 'text-slate-700' : 'text-slate-400')}>{label}</span>
    </div>
  );
}

export default function VibeCatalogPage() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState<VibeComponent | null>(null);

  const filteredComponents = useMemo(() => {
    return vibeComponents.filter(vc => {
      if (search && !vc.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (levelFilter !== 'all' && vc.level !== levelFilter) return false;
      if (statusFilter !== 'all' && vc.vibeStatus !== statusFilter) return false;
      return true;
    });
  }, [search, levelFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: vibeComponents.length,
    approved: vibeComponents.filter(vc => vc.vibeStatus === 'approved').length,
    inReview: vibeComponents.filter(vc => ['review', 'in_progress'].includes(vc.vibeStatus)).length,
    avgCompleteness: Math.round(
      vibeComponents.reduce((s, vc) => {
        const checks = [vc.hasContract, vc.hasRules, vc.hasTests, vc.hasEvolution];
        return s + (checks.filter(Boolean).length / checks.length) * 100;
      }, 0) / vibeComponents.length
    ),
  }), []);

  const levelGroups = useMemo(() => {
    const groups: Record<string, VibeComponent[]> = { L0: [], L1: [], L2: [], L3: [], L4: [] };
    filteredComponents.forEach(vc => groups[vc.level]?.push(vc));
    return groups;
  }, [filteredComponents]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Vibe 百科</h1>
          <p className="text-sm text-slate-500">组件 Vibe Design 目录 —— 每个组件都有灵魂</p>
        </div>
        <Button size="sm" className="gap-1.5 bg-indigo-600 text-xs hover:bg-indigo-700">
          <Sparkles className="h-3.5 w-3.5" />注册组件
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
              <Blocks className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{stats.total}</p>
              <p className="text-[11px] text-slate-500">组件总数</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{stats.approved}</p>
              <p className="text-[11px] text-slate-500">已通过审核</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{stats.inReview}</p>
              <p className="text-[11px] text-slate-500">审核中</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{stats.avgCompleteness}%</p>
              <p className="text-[11px] text-slate-500">平均完整度</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="搜索组件名称..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-slate-200 bg-slate-50 pl-8 text-sm"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="组件级别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部级别</SelectItem>
              <SelectItem value="L0">L0 原子</SelectItem>
              <SelectItem value="L1">L1 基础复合</SelectItem>
              <SelectItem value="L2">L2 业务</SelectItem>
              <SelectItem value="L3">L3 数据</SelectItem>
              <SelectItem value="L4">L4 页面编排</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Vibe 状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="defined">已定义</SelectItem>
              <SelectItem value="in_progress">进行中</SelectItem>
              <SelectItem value="review">审核中</SelectItem>
              <SelectItem value="approved">已通过</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Component List by Level */}
      {(['L4', 'L3', 'L2', 'L1', 'L0'] as const).map(level => {
        const items = levelGroups[level];
        if (items.length === 0) return null;
        const levelNames: Record<string, string> = {
          L0: 'L0 - 原子组件', L1: 'L1 - 基础复合组件', L2: 'L2 - 业务组件', L3: 'L3 - 数据组件', L4: 'L4 - 页面编排组件',
        };
        const levelColors: Record<string, string> = {
          L0: 'border-slate-300 bg-slate-50', L1: 'border-sky-300 bg-sky-50', L2: 'border-indigo-300 bg-indigo-50',
          L3: 'border-violet-300 bg-violet-50', L4: 'border-rose-300 bg-rose-50',
        };
        return (
          <div key={level} className="space-y-3">
            <div className={cn('flex items-center gap-2 rounded-lg border px-3 py-2', levelColors[level])}>
              <span className="text-xs font-semibold text-slate-700">{levelNames[level]}</span>
              <Badge variant="secondary" className="text-[10px]">{items.length}</Badge>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {items.map(vc => {
                const completeness = [vc.hasContract, vc.hasRules, vc.hasTests, vc.hasEvolution].filter(Boolean).length;
                const pct = (completeness / 4) * 100;
                return (
                  <Card
                    key={vc.id}
                    className="border-slate-200 bg-white transition-shadow hover:shadow-md cursor-pointer"
                    onClick={() => setSelectedComponent(vc)}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-indigo-500" />
                          <span className="text-sm font-semibold text-slate-800">{vc.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <LevelBadge level={vc.level} />
                          <VibeStatusBadge status={vc.vibeStatus} />
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2">{vc.description}</p>

                      {/* Completeness */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Vibe 完整度</span>
                          <span className="font-medium text-slate-700">{completeness}/4</span>
                        </div>
                        <Progress value={pct} className="h-1" />
                        <div className="grid grid-cols-2 gap-1">
                          <CompletenessCheck label="契约" done={vc.hasContract} />
                          <CompletenessCheck label="规则" done={vc.hasRules} />
                          <CompletenessCheck label="测试" done={vc.hasTests} />
                          <CompletenessCheck label="进化日志" done={vc.hasEvolution} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-500">
                        <span>v{vc.version}</span>
                        <span>负责人: {getMemberName(vc.owner)}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Detail Dialog */}
      {selectedComponent && (
        <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-indigo-500" />
                <DialogTitle className="text-base">{selectedComponent.name}</DialogTitle>
                <LevelBadge level={selectedComponent.level} />
                <VibeStatusBadge status={selectedComponent.vibeStatus} />
              </div>
              <DialogDescription>{selectedComponent.description}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Vibe Files */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-500">Vibe Design 文件</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'vibe.md', label: '灵魂定义', done: true, icon: Sparkles, desc: '组件是什么、不是什么、适合什么场景' },
                    { name: 'contract.ts', label: '契约定义', done: selectedComponent.hasContract, icon: FileCheck, desc: '输入/输出/边界条件 Zod Schema' },
                    { name: 'rules.md', label: '生成规则', done: selectedComponent.hasRules, icon: Shield, desc: 'AI 生成时的约束和禁止行为' },
                    { name: 'test.spec.ts', label: '测试规范', done: selectedComponent.hasTests, icon: CheckCircle2, desc: '质量验证标准和测试用例' },
                    { name: 'evolution.md', label: '进化日志', done: selectedComponent.hasEvolution, icon: History, desc: 'Prompt 迭代历史和变更记录' },
                  ].map(file => (
                    <div
                      key={file.name}
                      className={cn(
                        'flex items-start gap-2.5 rounded-lg border p-3',
                        file.done ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-200 bg-slate-50',
                      )}
                    >
                      <file.icon className={cn('h-4 w-4 mt-0.5 shrink-0', file.done ? 'text-emerald-500' : 'text-slate-300')} />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-slate-700">{file.name}</span>
                          <span className="text-[10px] text-slate-500">({file.label})</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">{file.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example vibe.md content */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-500">vibe.md 预览</span>
                <div className="rounded-lg border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-300 space-y-2">
                  <p className="text-indigo-400"># {selectedComponent.name} Vibe 灵魂定义</p>
                  <p className="text-slate-500">## 我是什么</p>
                  <p>{selectedComponent.description}</p>
                  <p className="text-slate-500">## 设计约束</p>
                  <p>- 遵循 shadcn/ui 风格规范</p>
                  <p>- 支持 light/dark 主题</p>
                  <p>- 响应式布局适配</p>
                  <p className="text-slate-500">## 版本</p>
                  <p>v{selectedComponent.version}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">负责人</span>
                  <p className="text-slate-700 font-medium">{getMemberName(selectedComponent.owner)}</p>
                </div>
                <div>
                  <span className="text-slate-500">最后更新</span>
                  <p className="text-slate-700 font-medium">{selectedComponent.lastUpdated.slice(0, 10)}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedComponent(null)}>关闭</Button>
              <Button size="sm" className="gap-1.5 bg-indigo-600 hover:bg-indigo-700">
                <Eye className="h-3.5 w-3.5" />查看完整 Vibe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
