// 核心类型定义

export type FileType = 'txt' | 'pdf' | 'epub';

export interface ChapterIndex {
  id: string;
  title: string;
  start: number;
  end?: number;
}

export interface BookMeta {
  id: string;
  title: string;
  type: FileType;
  size: number;
  chapters?: ChapterIndex[];
  addedAt: number;
  lastReadAt?: number;
}

export interface Progress {
  bookId: string;
  index: number;
  updatedAt: number;
}

export type Theme = 'word-blue' | 'excel-green' | 'dark';
export type RevealUnit = 'char' | 'word' | 'sentence';
export type Language = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR';

export interface Hotkeys {
  toggleDecoy: string;  // 切换伪装模式
  recall: string;       // 回退
  fastReveal: string;   // 快速显露
  skipAhead: string;    // 快进
}

export interface Settings {
  theme: Theme;
  revealUnit: RevealUnit;
  fastFactor: number;
  fakeTitle: string;
  charsPerKey: number;
  charsPerSpace: number;
  hotkeys: Hotkeys;
  language: Language;
}

export interface BookSource {
  id: string;
  type: FileType;
  title: string;
  author?: string;
  chapters: ChapterIndex[];
  content: string;
  size: number;
}

export type ViewMode = 'reader' | 'decoy';

