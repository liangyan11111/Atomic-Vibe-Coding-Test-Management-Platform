'use client';

import { useState, useCallback } from 'react';
import { MessageSquare, X, Send, Sparkles, ChevronRight, Zap, Settings, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * 全局 Vibe 入口 - 底部悬浮按钮
 * 三层 Vibe 入口的最顶层：跨模块对话 / 新增功能 / 系统级优化
 */

interface VibeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GlobalVibeEntryProps {
  className?: string;
}

const QUICK_ACTIONS = [
  { icon: Zap, label: '新增功能', desc: '描述你想要的功能' },
  { icon: Settings, label: '系统优化', desc: '优化现有系统表现' },
  { icon: HelpCircle, label: '使用帮助', desc: '了解平台功能' },
];

export function GlobalVibeEntry({ className }: GlobalVibeEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<VibeMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是 TestHub AI 助手。你可以让我帮你新增功能、优化现有模块，或者解答使用问题。试试下方的快捷操作，或直接输入你的需求。',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    const userMsg: VibeMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // 模拟 AI 响应
    setTimeout(() => {
      const aiMsg: VibeMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `收到你的需求："${userMsg.content}"。我正在分析并生成方案...\n\n**方案预览：**\n- 已理解需求上下文\n- 正在检查相关组件契约\n- 准备生成代码变更\n\n> 这是一个演示响应。在完整实现中，这里会展示代码 Diff + 效果预览，确认后应用变更。`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  }, [input]);

  const handleQuickAction = useCallback((label: string) => {
    setInput(`${label}：`);
  }, []);

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 shadow-lg transition-all duration-200',
          isOpen
            ? 'bg-slate-700 text-white hover:bg-slate-600'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl',
          className
        )}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        {!isOpen && <span className="text-sm font-medium">Vibe</span>}
      </button>

      {/* 对话面板 */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 flex w-[420px] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* 头部 */}
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
              <Sparkles className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Vibe 工作台</h3>
              <p className="text-xs text-slate-500">AI 原生对话入口</p>
            </div>
          </div>

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto px-5 py-4" style={{ maxHeight: '400px' }}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 快捷操作 */}
          {messages.length <= 1 && (
            <div className="border-t border-slate-100 px-5 py-3">
              <p className="mb-2 text-xs font-medium text-slate-500">快捷操作</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.label)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <action.icon className="h-3 w-3" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 输入区 */}
          <div className="border-t border-slate-100 px-5 py-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="描述你的需求..."
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100"
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-9 w-9 rounded-lg bg-indigo-600 p-0 hover:bg-indigo-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
