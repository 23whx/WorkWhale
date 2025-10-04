// IndexedDB 存储管理
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { BookMeta, Progress, Settings } from '@/types';

interface WorkWhaleDB extends DBSchema {
  books: {
    key: string;
    value: BookMeta;
    indexes: { 'by-date': number };
  };
  progress: {
    key: string;
    value: Progress;
  };
  settings: {
    key: string;
    value: Settings;
  };
  bookContent: {
    key: string;
    value: { id: string; content: string };
  };
}

let dbInstance: IDBPDatabase<WorkWhaleDB> | null = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<WorkWhaleDB>('workwhale-db', 1, {
    upgrade(db) {
      // 书籍元数据
      if (!db.objectStoreNames.contains('books')) {
        const bookStore = db.createObjectStore('books', { keyPath: 'id' });
        bookStore.createIndex('by-date', 'lastReadAt');
      }

      // 阅读进度
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress', { keyPath: 'bookId' });
      }

      // 设置
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }

      // 书籍内容
      if (!db.objectStoreNames.contains('bookContent')) {
        db.createObjectStore('bookContent', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// 书籍操作
export async function saveBook(book: BookMeta) {
  const db = await getDB();
  await db.put('books', book);
}

export async function getBook(id: string): Promise<BookMeta | undefined> {
  const db = await getDB();
  return db.get('books', id);
}

export async function getAllBooks(): Promise<BookMeta[]> {
  const db = await getDB();
  const books = await db.getAll('books');
  return books.sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0));
}

// 清理重复的书籍记录（基于标题和大小）
export async function cleanupDuplicateBooks() {
  const db = await getDB();
  const books = await db.getAll('books');
  
  // 按标题和大小分组
  const bookGroups = new Map<string, BookMeta[]>();
  
  books.forEach(book => {
    const key = `${book.title}-${book.size}`;
    if (!bookGroups.has(key)) {
      bookGroups.set(key, []);
    }
    bookGroups.get(key)!.push(book);
  });
  
  // 对于每组重复的书籍，只保留最新的一本
  for (const [key, group] of bookGroups) {
    if (group.length > 1) {
      // 按最后阅读时间排序，保留最新的
      group.sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0));
      const keepBook = group[0];
      
      // 删除其他重复项
      for (let i = 1; i < group.length; i++) {
        await db.delete('books', group[i].id);
        await db.delete('bookContent', group[i].id);
        await db.delete('progress', group[i].id);
        console.log('删除重复书籍:', group[i].title, group[i].id);
      }
    }
  }
}

export async function deleteBook(id: string) {
  const db = await getDB();
  await db.delete('books', id);
  await db.delete('bookContent', id);
  await db.delete('progress', id);
}

// 书籍内容操作
export async function saveBookContent(id: string, content: string) {
  const db = await getDB();
  await db.put('bookContent', { id, content });
}

export async function getBookContent(id: string): Promise<string | undefined> {
  const db = await getDB();
  const result = await db.get('bookContent', id);
  return result?.content;
}

// 进度操作
export async function saveProgress(progress: Progress) {
  const db = await getDB();
  await db.put('progress', progress);
}

export async function getProgress(bookId: string): Promise<Progress | undefined> {
  const db = await getDB();
  return db.get('progress', bookId);
}

// 设置操作
export async function saveSettings(settings: Settings) {
  const db = await getDB();
  await db.put('settings', { key: 'main', ...settings } as any);
}

export async function getSettings(): Promise<Settings | undefined> {
  const db = await getDB();
  const result = await db.get('settings', 'main');
  return result as Settings | undefined;
}

// 默认设置
export const defaultSettings: Settings = {
  theme: 'word-blue',
  revealUnit: 'char',
  fastFactor: 4,
  fakeTitle: 'Document1 - Microsoft Word',
  charsPerKey: 1,
  charsPerSpace: 4,
  hotkeys: {
    toggleDecoy: 'Enter',
    recall: 'Backspace',
    fastReveal: ' ',  // Space
    skipAhead: 'Tab',
  },
  language: 'zh-CN',  // 默认简体中文
};

