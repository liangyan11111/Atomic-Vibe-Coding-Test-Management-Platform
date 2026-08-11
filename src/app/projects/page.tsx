'use client';

import { useState } from 'react';
import {
  Plus, Users, FileText, Bug, Calendar, MoreHorizontal,
  FolderKanban, Settings, Eye, Archive,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { projects, testCases, testPlans, defects, teamMembers, getMemberName, formatDate } from '@/lib/mock-data';
import type { Project } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const getProjectStats = (projectId: string) => ({
    cases: testCases.filter(tc => tc.projectId === projectId).length,
    plans: testPlans.filter(tp => tp.projectId === projectId).length,
    defects: defects.filter(d => d.projectId === projectId).length,
    members: teamMembers.filter(m => m.projectId === projectId).length,
    activePlans: testPlans.filter(tp => tp.projectId === projectId && tp.status === 'in_progress').length,
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">项目管理</h1>
          <p className="text-sm text-slate-500">管理所有测试项目，查看项目概览和成员</p>
        </div>
        <Button size="sm" className="gap-1.5 bg-indigo-600 text-xs hover:bg-indigo-700" onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-3.5 w-3.5" />新建项目
        </Button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-2 gap-4">
        {projects.map(project => {
          const stats = getProjectStats(project.id);
          const projectMembers = teamMembers.filter(m => m.projectId === project.id);
          return (
            <Card
              key={project.id}
              className="border-slate-200 bg-white transition-shadow hover:shadow-md cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm"
                      style={{ backgroundColor: project.coverColor }}
                    >
                      {project.name.slice(0, 1)}
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-800">{project.name}</CardTitle>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="mt-1 text-[10px]">
                        {project.status === 'active' ? '活跃' : '已归档'}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      <DropdownMenuItem><Eye className="mr-2 h-3.5 w-3.5" />查看</DropdownMenuItem>
                      <DropdownMenuItem><Settings className="mr-2 h-3.5 w-3.5" />设置</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Archive className="mr-2 h-3.5 w-3.5" />归档</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription className="text-xs line-clamp-2 mt-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '用例', value: stats.cases, icon: FileText, color: 'text-indigo-600 bg-indigo-50' },
                    { label: '计划', value: stats.plans, icon: Calendar, color: 'text-violet-600 bg-violet-50' },
                    { label: '缺陷', value: stats.defects, icon: Bug, color: 'text-rose-600 bg-rose-50' },
                    { label: '成员', value: stats.members, icon: Users, color: 'text-sky-600 bg-sky-50' },
                  ].map(item => (
                    <div key={item.label} className="flex flex-col items-center rounded-lg bg-slate-50 py-2">
                      <div className={cn('flex h-6 w-6 items-center justify-center rounded-md mb-1', item.color)}>
                        <item.icon className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{item.value}</span>
                      <span className="text-[10px] text-slate-500">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Active Plans */}
                {stats.activePlans > 0 && (
                  <div className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2">
                    <span className="text-[11px] text-indigo-700 font-medium">
                      {stats.activePlans} 个测试计划进行中
                    </span>
                  </div>
                )}

                {/* Members */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex -space-x-2">
                    {projectMembers.slice(0, 5).map(m => (
                      <Avatar key={m.id} className="h-6 w-6 border-2 border-white">
                        <AvatarFallback className="bg-indigo-100 text-[9px] font-medium text-indigo-700">
                          {m.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {projectMembers.length > 5 && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[9px] text-slate-500">
                        +{projectMembers.length - 5}
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">更新于 {formatDate(project.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold text-sm"
                  style={{ backgroundColor: selectedProject.coverColor }}
                >
                  {selectedProject.name.slice(0, 1)}
                </div>
                <div>
                  <DialogTitle className="text-base">{selectedProject.name}</DialogTitle>
                  <DialogDescription>{selectedProject.description}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: '测试用例', value: testCases.filter(tc => tc.projectId === selectedProject.id).length, color: 'bg-indigo-50 text-indigo-700' },
                  { label: '测试计划', value: testPlans.filter(tp => tp.projectId === selectedProject.id).length, color: 'bg-violet-50 text-violet-700' },
                  { label: '缺陷总数', value: defects.filter(d => d.projectId === selectedProject.id).length, color: 'bg-rose-50 text-rose-700' },
                  { label: '团队成员', value: teamMembers.filter(m => m.projectId === selectedProject.id).length, color: 'bg-sky-50 text-sky-700' },
                ].map(item => (
                  <div key={item.label} className={cn('rounded-lg p-3 text-center', item.color)}>
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-[10px]">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-medium text-slate-500">团队成员</span>
                <div className="space-y-1.5">
                  {teamMembers.filter(m => m.projectId === selectedProject.id).map(m => (
                    <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-indigo-100 text-[10px] font-medium text-indigo-700">{m.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-slate-700">{m.name}</p>
                          <p className="text-[10px] text-slate-500">{m.email}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {m.role === 'admin' ? '管理员' : m.role === 'manager' ? '经理' : m.role === 'tester' ? '测试' : '开发'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500">创建时间</span>
                  <p className="text-slate-700 font-medium">{formatDate(selectedProject.createdAt)}</p>
                </div>
                <div>
                  <span className="text-slate-500">最后更新</span>
                  <p className="text-slate-700 font-medium">{formatDate(selectedProject.updatedAt)}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setSelectedProject(null)}>关闭</Button>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">项目设置</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>创建一个新的测试项目</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">项目名称</Label>
              <Input placeholder="输入项目名称" className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">项目描述</Label>
              <Textarea placeholder="描述项目范围和目标" className="text-sm min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCreateDialog(false)}>取消</Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowCreateDialog(false)}>创建项目</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
