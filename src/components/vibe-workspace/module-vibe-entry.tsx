'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Wrench, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * 模块级 Vibe 入口 - 每个模块右上角
 * 三层 Vibe 入口的中间层：模块内全局优化 / 新增子功能 / 模块重构
 */

interface ModuleVibeEntryProps {
  moduleName: string;
  modulePath: string;
  className?: string;
}

interface ModuleMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const MODULE_ACTIONS = [
  { icon: Plus, label: '新增子功能', key: 'add' },
  { icon: Wrench, label: '优化现有功能', key: 'optimize' },
  { icon: RefreshCw, label: '模块重构', key: 'refactor' },
];

export function ModuleVibeEntry({ moduleName, className }: ModuleVibeEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ModuleMessage[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ModuleMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg: ModuleMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `收到！我正在分析「${moduleName}」模块的上下文...\n\n已识别到相关组件契约：\n- 组件级 Vibe Design 已加载\n- 业务规则契约已校验\n\n方案生成中，请稍候...`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const handleAction = (key: string) => {
    const actionLabels: Record<string, string> = {
      add: `我想在${moduleName}模块中新增一个功能：`,
      optimize: `帮我优化${moduleName}模块中的：`,
      refactor: `帮我重构${moduleName}模块的：`,
    };
    setInput(actionLabels[key] || '');
  };

  return (
    <div className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-1.5 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Vibe</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full z-40 mt-2 w-[380px] rounded-xl border border-slate-200 bg-white shadow-xl">
          {/* 头部 */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-900">{moduleName}</span>
              <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
                模块级
              </span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* 消息区 */}
          <div className="max-h-[280px] overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">选择操作类型或描述你的需求：</p>
                <div className="flex flex-wrap gap-2">
                  {MODULE_ACTIONS.map((action) => (
                    <button
                      key={action.key}
                      onClick={() => handleAction(action.key)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      <action.icon className="h-3 w-3" />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed',
                        msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 输入区 */}
          <div className="border-t border-slate-100 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`对「${moduleName}」说...`}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
              />
              <Button
                size="sm"
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-7 w-7 rounded-md bg-indigo-600 p-0 hover:bg-indigo-700"
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
