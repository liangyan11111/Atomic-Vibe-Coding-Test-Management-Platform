/**
 * AI 生成组件示例 - 用例搜索组件
 * 此文件展示 AI 在 Vibe Design 约束下生成的组件
 * 
 * 生成依据：
 * - components/vibe-catalog/search-input/vibe.md
 * - components/vibe-catalog/search-input/contract.ts
 * - components/vibe-catalog/search-input/rules.md
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { SearchStateSchema, type SearchState } from '@/components/vibe-catalog/search-input/contract';
import { cn } from '@/lib/utils';

interface SearchInputGeneratedProps {
  placeholder?: string;
  debounceMs?: number;
  maxLength?: number;
  disabled?: boolean;
  onSearch?: (query: string) => void;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInputGenerated({
  placeholder = '搜索...',
  debounceMs = 300,
  maxLength = 100,
  disabled = false,
  onSearch,
  onChange,
  className,
}: SearchInputGeneratedProps) {
  const [value, setValue] = useState('');
  const [state, setState] = useState<SearchState>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounce 搜索
  const debouncedSearch = useCallback(
    (query: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      
      if (!query.trim()) {
        setState('idle');
        return;
      }

      setState('typing');
      timerRef.current = setTimeout(() => {
        setState('searching');
        onSearch?.(query);
        // 搜索完成后由外部通过 props 控制状态变化
        setTimeout(() => setState('success'), 300);
      }, debounceMs);
    },
    [debounceMs, onSearch]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = (newValue: string) => {
    const truncated = newValue.slice(0, maxLength);
    setValue(truncated);
    onChange?.(truncated);
    debouncedSearch(truncated);
  };

  const handleClear = () => {
    setValue('');
    setState('idle');
    onChange?.('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState('searching');
      onSearch?.(value);
    }
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          'h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-16 text-sm outline-none transition-colors',
          'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
          'disabled:cursor-not-allowed disabled:opacity-50',
        )}
      />
      <div className="absolute right-3 flex items-center gap-1">
        {state === 'searching' && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
        {value && state !== 'searching' && (
          <button onClick={handleClear} className="text-slate-400 hover:text-slate-600">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
