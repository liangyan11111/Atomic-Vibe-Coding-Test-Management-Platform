import { z } from 'zod';

// ============ SearchInput 契约 ============
// 定义组件的输入/输出/行为契约，AI 生成时必须遵循

export const SearchInputPropsSchema = z.object({
  placeholder: z.string().default('搜索...'),
  debounceMs: z.number().default(300),
  maxLength: z.number().default(100),
  disabled: z.boolean().default(false),
});

export type SearchInputProps = z.infer<typeof SearchInputPropsSchema>;

export const SearchStateSchema = z.enum(['idle', 'typing', 'searching', 'success', 'empty', 'error']);
export type SearchState = z.infer<typeof SearchStateSchema>;

export const SearchErrorCodes = z.enum(['QUERY_TOO_SHORT', 'QUERY_TOO_LONG', 'SEARCH_TIMEOUT', 'SEARCH_FAILED']);
export type SearchErrorCode = z.infer<typeof SearchErrorCodes>;
