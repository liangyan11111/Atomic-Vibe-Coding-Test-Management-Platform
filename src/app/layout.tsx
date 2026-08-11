import type { Metadata } from 'next';
import './globals.css';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { TopBar } from '@/components/layout/top-bar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'TestHub - 测试管理平台',
  description: '基于 Vibe Coding 架构的生态完整测试管理平台',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SidebarProvider>
          <div className="flex h-screen w-full overflow-hidden bg-slate-50">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopBar />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
