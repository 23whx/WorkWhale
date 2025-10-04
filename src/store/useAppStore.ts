// 应用状态管理
import { create } from 'zustand';
import { BookMeta, Settings, ViewMode, BookSource } from '@/types';
import { defaultSettings } from '@/core/storage';

interface AppState {
  // 当前状态
  viewMode: ViewMode;
  currentBook: BookSource | null;
  currentBookMeta: BookMeta | null;
  revealedText: string;
  readingIndex: number;
  
  // 设置
  settings: Settings;
  
  // 书籍列表
  recentBooks: BookMeta[];
  
  // 加载状态
  isLoading: boolean;
  loadingMessage: string;
  
  // UI设置
  fontSize: number;
  fontFamily: string;
  
  // Actions
  setViewMode: (mode: ViewMode) => void;
  setCurrentBook: (book: BookSource | null, meta: BookMeta | null) => void;
  setRevealedText: (text: string) => void;
  setReadingIndex: (index: number) => void;
  appendRevealedText: (text: string) => void;
  setSettings: (settings: Settings) => void;
  setRecentBooks: (books: BookMeta[]) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: string) => void;
  resetReading: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初始状态
  viewMode: 'reader',
  currentBook: null,
  currentBookMeta: null,
  revealedText: '',
  readingIndex: 0,
  settings: defaultSettings,
  recentBooks: [],
  isLoading: false,
  loadingMessage: '',
  fontSize: 16,
  fontFamily: 'Calibri',
  
  // Actions
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setCurrentBook: (book, meta) => set({ 
    currentBook: book,
    currentBookMeta: meta,
    revealedText: '',
    readingIndex: 0,
  }),
  
  setRevealedText: (text) => set({ revealedText: String(text || '') }),
  
  setReadingIndex: (index) => set({ readingIndex: index }),
  
  appendRevealedText: (text) => set((state) => ({ 
    revealedText: String(state.revealedText || '') + String(text || '')
  })),
  
  setSettings: (settings) => set({ settings }),
  
  setRecentBooks: (books) => set({ recentBooks: books }),
  
  setLoading: (loading, message = '') => set({ 
    isLoading: loading, 
    loadingMessage: message 
  }),
  
  setFontSize: (size) => set({ fontSize: size }),
  
  setFontFamily: (family) => set({ fontFamily: family }),
  
  resetReading: () => set({
    revealedText: '',
    readingIndex: 0,
  }),
}));

