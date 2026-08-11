'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Bug,
  BarChart3,
  FolderKanban,
  Blocks,
  Settings,
  ChevronLeft,
  TestTube2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

const navItems = [
  { title: '仪表盘', href: '/', icon: LayoutDashboard },
  { title: '用例管理', href: '/test-cases', icon: FileText },
  { title: '测试计划', href: '/test-plans', icon: ClipboardList },
  { title: '缺陷管理', href: '/defects', icon: Bug },
  { title: '测试报告', href: '/reports', icon: BarChart3 },
  { title: '项目管理', href: '/projects', icon: FolderKanban },
];

const advancedItems = [
  { title: 'Vibe 百科', href: '/vibe-catalog', icon: Blocks },
  { title: '设置', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, state } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-800">
      <SidebarHeader className="border-b border-slate-800 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
            <TestTube2 className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-semibold text-white">TestHub</span>
            <span className="truncate text-[10px] text-slate-400">测试管理平台</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500">核心功能</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'text-slate-300 hover:bg-slate-800 hover:text-white',
                        isActive && 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/20 hover:text-indigo-200',
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500">高级</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {advancedItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'text-slate-300 hover:bg-slate-800 hover:text-white',
                        isActive && 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/20 hover:text-indigo-200',
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              className="text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <ChevronLeft className={cn('h-4 w-4 transition-transform', state === 'collapsed' && 'rotate-180')} />
              <span>收起侧栏</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
