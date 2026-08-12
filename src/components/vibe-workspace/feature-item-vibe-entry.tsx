'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Sparkles, Copy, Trash2, History, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * 功能项级 Vibe 入口 - 每个功能项的操作菜单
 * 三层 Vibe 入口的最底层：单个功能优化 / 删除 / 复制 / 查看历史
 */

interface FeatureItemVibeEntryProps {
  itemId: string;
  itemType: string;
  itemTitle: string;
  onAction?: (action: string) => void;
  className?: string;
}

export function FeatureItemVibeEntry({
  itemId,
  itemType,
  itemTitle,
  onAction,
  className,
}: FeatureItemVibeEntryProps) {
  const [showVibeChat, setShowVibeChat] = useState(false);
  const [vibeInput, setVibeInput] = useState('');

  const handleVibeAction = (action: string) => {
    const actionLabels: Record<string, string> = {
      optimize: `优化这个${itemType}：`,
      fix: `这个${itemType}有个问题：`,
      history: `查看这个${itemType}的变更历史`,
      copy: `复制这个${itemType}并修改：`,
    };
    setVibeInput(actionLabels[action] || '');
    setShowVibeChat(true);
    onAction?.(action);
  };

  const handleSend = () => {
    if (!vibeInput.trim()) return;
    // 模拟发送
    setTimeout(() => {
      setVibeInput('');
      setShowVibeChat(false);
    }, 500);
  };

  return (
    <div className={cn('relative', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600">
            <MessageSquare className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleVibeAction('optimize')}>
            <Edit3 className="mr-2 h-3.5 w-3.5" />
            优化这个{itemType}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVibeAction('fix')}>
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            修复问题
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVibeAction('history')}>
            <History className="mr-2 h-3.5 w-3.5" />
            查看历史
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleVibeAction('copy')}>
            <Copy className="mr-2 h-3.5 w-3.5" />
            复制
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAction?.('delete')}
            className="text-rose-600 focus:bg-rose-50 focus:text-rose-700"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            删除
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 迷你 Vibe 对话 */}
      {showVibeChat && (
        <div className="absolute right-0 top-full z-40 mt-1 w-[300px] rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">
              Vibe · {itemTitle}
            </span>
            <button onClick={() => setShowVibeChat(false)} className="text-slate-400 hover:text-slate-600">
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={vibeInput}
              onChange={(e) => setVibeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="描述你的需求..."
              className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs outline-none focus:border-indigo-400"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleSend}
              className="h-6 w-6 rounded p-0 bg-indigo-600 hover:bg-indigo-700"
            >
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
