'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const routeNames: Record<string, string> = {
  '/': '仪表盘',
  '/test-cases': '用例管理',
  '/test-plans': '测试计划',
  '/defects': '缺陷管理',
  '/reports': '测试报告',
  '/projects': '项目管理',
  '/vibe-catalog': 'Vibe 百科',
  '/settings': '设置',
};

export function TopBar() {
  const pathname = usePathname();
  const pageName = routeNames[pathname] || '页面';

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6">
      <nav className="flex items-center gap-1 text-sm">
        <span className="text-slate-400">TestHub</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="font-medium text-slate-700">{pageName}</span>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="搜索用例、计划、缺陷..."
            className="h-8 border-slate-200 bg-slate-50 pl-8 text-sm placeholder:text-slate-400"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-slate-500 hover:text-slate-700">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-medium text-white">
            3
          </span>
        </Button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-indigo-100 text-xs font-medium text-indigo-700">
              ZM
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-700">张明</span>
            <Badge variant="secondary" className="text-[10px] leading-tight">管理员</Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
