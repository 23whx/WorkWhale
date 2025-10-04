// 多语言翻译配置

import { Language } from '@/types';

export interface Translation {
  // 通用
  common: {
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    close: string;
    reset: string;
    search: string;
    settings: string;
  };
  
  // 文件导入
  fileImport: {
    title: string;
    subtitle: string;
    dragDrop: string;
    or: string;
    selectFile: string;
    recentBooks: string;
    noRecentBooks: string;
    supportedFormats: string;
    usageGuide: string;
    tip1: string;
    tip2: string;
    tip3: string;
    tip4: string;
    tip5: string;
  };
  
  // 阅读视图
  reader: {
    loading: string;
    noContent: string;
  };
  
  // 设置
  settings: {
    title: string;
    language: string;
    languageLabel: {
      'zh-CN': string;
      'en-US': string;
      'ja-JP': string;
      'ko-KR': string;
    };
    hotkeys: string;
    hotkeyLabels: {
      toggleDecoy: string;
      recall: string;
      fastReveal: string;
      skipAhead: string;
    };
    currentKey: string;
    clickToChange: string;
    pressKey: string;
    conflictWarning: string;
    resetToDefault: string;
    fontSettings: string;
    fontSize: string;
    fontFamily: string;
  };
  
  // 目录
  toc: {
    title: string;
    noChapters: string;
    jumpTo: string;
  };
  
  // Ribbon
  ribbon: {
    file: string;
    home: string;
    insert: string;
    design: string;
    layout: string;
    references: string;
    mailings: string;
    review: string;
    view: string;
    help: string;
    clipboard: string;
    paste: string;
    cut: string;
    copy: string;
    formatPainter: string;
    font: string;
    paragraph: string;
    styles: string;
    editing: string;
    find: string;
    replace: string;
    select: string;
    navigation: string;
    toc: string;
    hotkeySettings: string;
  };
  
  // 状态栏
  statusBar: {
    page: string;
    words: string;
    progress: string;
    language: string;
    read: string;
    total: string;
    readingProgress: string;
    backward: string;
    forward: string;
    dragToAdjust: string;
  };
  
  // 错误提示
  errors: {
    invalidFileType: string;
    fileParseError: string;
    fileEmpty: string;
    loadError: string;
  };
  
  // 伪装文本
  decoy: {
    title: string;
    pressEnterToReturn: string;
  };
}

export const translations: Record<Language, Translation> = {
  'zh-CN': {
    common: {
      confirm: '确定',
      cancel: '取消',
      save: '保存',
      delete: '删除',
      close: '关闭',
      reset: '重置',
      search: '搜索',
      settings: '设置',
    },
    fileImport: {
      title: 'WorkWhale 摸鱼阅读器',
      subtitle: '伪装成Word的在线阅读器',
      dragDrop: '拖拽文件到此处',
      or: '或',
      selectFile: '选择文件',
      recentBooks: '最近阅读',
      noRecentBooks: '暂无最近阅读的书籍',
      supportedFormats: '支持格式',
      usageGuide: '使用提示',
      tip1: '按任意字母键逐字显示内容',
      tip2: '按空格键快速显示多个字符',
      tip3: '按 Enter 键切换伪装模式',
      tip4: '按 Tab 键快进，Backspace 回退',
      tip5: '点击右上角⚙️设置自定义热键',
    },
    reader: {
      loading: '加载中...',
      noContent: '暂无内容',
    },
    settings: {
      title: '设置',
      language: '语言',
      languageLabel: {
        'zh-CN': '简体中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어',
      },
      hotkeys: '热键设置',
      hotkeyLabels: {
        toggleDecoy: '切换伪装',
        recall: '回退',
        fastReveal: '快速显露',
        skipAhead: '快进',
      },
      currentKey: '当前',
      clickToChange: '点击修改',
      pressKey: '请按键...',
      conflictWarning: '与其他热键冲突',
      resetToDefault: '恢复默认',
      fontSettings: '字体设置',
      fontSize: '字号',
      fontFamily: '字体',
    },
    toc: {
      title: '目录',
      noChapters: '此文件无目录',
      jumpTo: '跳转到',
    },
    ribbon: {
      file: '文件',
      home: '开始',
      insert: '插入',
      design: '设计',
      layout: '布局',
      references: '引用',
      mailings: '邮件',
      review: '审阅',
      view: '视图',
      help: '帮助',
      clipboard: '剪贴板',
      paste: '粘贴',
      cut: '剪切',
      copy: '复制',
      formatPainter: '格式刷',
      font: '字体',
      paragraph: '段落',
      styles: '样式',
      editing: '编辑',
      find: '查找',
      replace: '替换',
      select: '选择',
      navigation: '导航',
      toc: '目录',
      hotkeySettings: '热键设置',
    },
    statusBar: {
      page: '页',
      words: '字',
      progress: '进度',
      language: '中文',
      read: '已读',
      total: '共',
      readingProgress: '阅读进度',
      backward: '后退 5%',
      forward: '前进 5%',
      dragToAdjust: '拖动调整进度',
    },
    errors: {
      invalidFileType: '不支持的文件格式',
      fileParseError: '文件解析失败',
      fileEmpty: '文件内容为空',
      loadError: '加载失败',
    },
    decoy: {
      title: '工作文档',
      pressEnterToReturn: '按 Enter 返回阅读',
    },
  },
  
  'en-US': {
    common: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      close: 'Close',
      reset: 'Reset',
      search: 'Search',
      settings: 'Settings',
    },
    fileImport: {
      title: 'WorkWhale Reader',
      subtitle: 'Online Reader Disguised as Word',
      dragDrop: 'Drag & drop files here',
      or: 'or',
      selectFile: 'Select File',
      recentBooks: 'Recent Books',
      noRecentBooks: 'No recent books',
      supportedFormats: 'Supported Formats',
      usageGuide: 'Usage Guide',
      tip1: 'Press any letter key to reveal text',
      tip2: 'Press Space for fast reveal',
      tip3: 'Press Enter to toggle decoy mode',
      tip4: 'Press Tab to skip ahead, Backspace to recall',
      tip5: 'Click ⚙️ in top-right to customize hotkeys',
    },
    reader: {
      loading: 'Loading...',
      noContent: 'No content',
    },
    settings: {
      title: 'Settings',
      language: 'Language',
      languageLabel: {
        'zh-CN': '简体中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어',
      },
      hotkeys: 'Hotkey Settings',
      hotkeyLabels: {
        toggleDecoy: 'Toggle Decoy',
        recall: 'Recall',
        fastReveal: 'Fast Reveal',
        skipAhead: 'Skip Ahead',
      },
      currentKey: 'Current',
      clickToChange: 'Click to change',
      pressKey: 'Press a key...',
      conflictWarning: 'Conflicts with other hotkey',
      resetToDefault: 'Reset to Default',
      fontSettings: 'Font Settings',
      fontSize: 'Font Size',
      fontFamily: 'Font Family',
    },
    toc: {
      title: 'Table of Contents',
      noChapters: 'No table of contents',
      jumpTo: 'Jump to',
    },
    ribbon: {
      file: 'File',
      home: 'Home',
      insert: 'Insert',
      design: 'Design',
      layout: 'Layout',
      references: 'References',
      mailings: 'Mailings',
      review: 'Review',
      view: 'View',
      help: 'Help',
      clipboard: 'Clipboard',
      paste: 'Paste',
      cut: 'Cut',
      copy: 'Copy',
      formatPainter: 'Format Painter',
      font: 'Font',
      paragraph: 'Paragraph',
      styles: 'Styles',
      editing: 'Editing',
      find: 'Find',
      replace: 'Replace',
      select: 'Select',
      navigation: 'Navigation',
      toc: 'TOC',
      hotkeySettings: 'Hotkey Settings',
    },
    statusBar: {
      page: 'Page',
      words: 'Words',
      progress: 'Progress',
      language: 'English',
      read: 'Read',
      total: 'Total',
      readingProgress: 'Reading Progress',
      backward: 'Back 5%',
      forward: 'Forward 5%',
      dragToAdjust: 'Drag to adjust progress',
    },
    errors: {
      invalidFileType: 'Unsupported file format',
      fileParseError: 'Failed to parse file',
      fileEmpty: 'File is empty',
      loadError: 'Load failed',
    },
    decoy: {
      title: 'Work Document',
      pressEnterToReturn: 'Press Enter to return',
    },
  },
  
  'ja-JP': {
    common: {
      confirm: '確認',
      cancel: 'キャンセル',
      save: '保存',
      delete: '削除',
      close: '閉じる',
      reset: 'リセット',
      search: '検索',
      settings: '設定',
    },
    fileImport: {
      title: 'WorkWhale リーダー',
      subtitle: 'Wordに偽装したオンラインリーダー',
      dragDrop: 'ファイルをここにドラッグ＆ドロップ',
      or: 'または',
      selectFile: 'ファイルを選択',
      recentBooks: '最近の書籍',
      noRecentBooks: '最近の書籍はありません',
      supportedFormats: '対応形式',
      usageGuide: '使い方',
      tip1: '任意の文字キーでテキストを表示',
      tip2: 'スペースキーで高速表示',
      tip3: 'Enterキーで偽装モード切替',
      tip4: 'Tabキーでスキップ、Backspaceで戻る',
      tip5: '右上の⚙️でホットキーをカスタマイズ',
    },
    reader: {
      loading: '読み込み中...',
      noContent: 'コンテンツなし',
    },
    settings: {
      title: '設定',
      language: '言語',
      languageLabel: {
        'zh-CN': '简体中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어',
      },
      hotkeys: 'ホットキー設定',
      hotkeyLabels: {
        toggleDecoy: '偽装切替',
        recall: '戻る',
        fastReveal: '高速表示',
        skipAhead: 'スキップ',
      },
      currentKey: '現在',
      clickToChange: 'クリックして変更',
      pressKey: 'キーを押してください...',
      conflictWarning: '他のホットキーと競合',
      resetToDefault: 'デフォルトに戻す',
      fontSettings: 'フォント設定',
      fontSize: 'フォントサイズ',
      fontFamily: 'フォント',
    },
    toc: {
      title: '目次',
      noChapters: '目次なし',
      jumpTo: 'ジャンプ',
    },
    ribbon: {
      file: 'ファイル',
      home: 'ホーム',
      insert: '挿入',
      design: 'デザイン',
      layout: 'レイアウト',
      references: '参照',
      mailings: '差し込み文書',
      review: '校閲',
      view: '表示',
      help: 'ヘルプ',
      clipboard: 'クリップボード',
      paste: '貼り付け',
      cut: '切り取り',
      copy: 'コピー',
      formatPainter: '書式のコピー/貼り付け',
      font: 'フォント',
      paragraph: '段落',
      styles: 'スタイル',
      editing: '編集',
      find: '検索',
      replace: '置換',
      select: '選択',
      navigation: 'ナビゲーション',
      toc: '目次',
      hotkeySettings: 'ホットキー設定',
    },
    statusBar: {
      page: 'ページ',
      words: '文字',
      progress: '進行状況',
      language: '日本語',
      read: '既読',
      total: '合計',
      readingProgress: '読書進度',
      backward: '戻る 5%',
      forward: '進む 5%',
      dragToAdjust: 'ドラッグして調整',
    },
    errors: {
      invalidFileType: 'サポートされていないファイル形式',
      fileParseError: 'ファイルの解析に失敗しました',
      fileEmpty: 'ファイルが空です',
      loadError: '読み込みに失敗しました',
    },
    decoy: {
      title: '作業文書',
      pressEnterToReturn: 'Enterキーで戻る',
    },
  },
  
  'ko-KR': {
    common: {
      confirm: '확인',
      cancel: '취소',
      save: '저장',
      delete: '삭제',
      close: '닫기',
      reset: '초기화',
      search: '검색',
      settings: '설정',
    },
    fileImport: {
      title: 'WorkWhale 리더',
      subtitle: 'Word로 위장한 온라인 리더',
      dragDrop: '파일을 여기에 드래그 앤 드롭',
      or: '또는',
      selectFile: '파일 선택',
      recentBooks: '최근 도서',
      noRecentBooks: '최근 도서가 없습니다',
      supportedFormats: '지원 형식',
      usageGuide: '사용 가이드',
      tip1: '아무 문자 키를 눌러 텍스트 표시',
      tip2: '스페이스바로 빠른 표시',
      tip3: 'Enter 키로 위장 모드 전환',
      tip4: 'Tab 키로 건너뛰기, Backspace로 되돌리기',
      tip5: '오른쪽 상단 ⚙️를 클릭하여 단축키 사용자 정의',
    },
    reader: {
      loading: '로딩 중...',
      noContent: '내용 없음',
    },
    settings: {
      title: '설정',
      language: '언어',
      languageLabel: {
        'zh-CN': '简体中文',
        'en-US': 'English',
        'ja-JP': '日本語',
        'ko-KR': '한국어',
      },
      hotkeys: '단축키 설정',
      hotkeyLabels: {
        toggleDecoy: '위장 전환',
        recall: '되돌리기',
        fastReveal: '빠른 표시',
        skipAhead: '건너뛰기',
      },
      currentKey: '현재',
      clickToChange: '클릭하여 변경',
      pressKey: '키를 누르세요...',
      conflictWarning: '다른 단축키와 충돌',
      resetToDefault: '기본값으로 재설정',
      fontSettings: '글꼴 설정',
      fontSize: '글꼴 크기',
      fontFamily: '글꼴',
    },
    toc: {
      title: '목차',
      noChapters: '목차 없음',
      jumpTo: '이동',
    },
    ribbon: {
      file: '파일',
      home: '홈',
      insert: '삽입',
      design: '디자인',
      layout: '레이아웃',
      references: '참조',
      mailings: '메일링',
      review: '검토',
      view: '보기',
      help: '도움말',
      clipboard: '클립보드',
      paste: '붙여넣기',
      cut: '자르기',
      copy: '복사',
      formatPainter: '서식 복사',
      font: '글꼴',
      paragraph: '단락',
      styles: '스타일',
      editing: '편집',
      find: '찾기',
      replace: '바꾸기',
      select: '선택',
      navigation: '탐색',
      toc: '목차',
      hotkeySettings: '단축키 설정',
    },
    statusBar: {
      page: '페이지',
      words: '단어',
      progress: '진행률',
      language: '한국어',
      read: '읽음',
      total: '총',
      readingProgress: '읽기 진행률',
      backward: '뒤로 5%',
      forward: '앞으로 5%',
      dragToAdjust: '드래그하여 조정',
    },
    errors: {
      invalidFileType: '지원되지 않는 파일 형식',
      fileParseError: '파일 분석 실패',
      fileEmpty: '파일이 비어 있습니다',
      loadError: '로드 실패',
    },
    decoy: {
      title: '작업 문서',
      pressEnterToReturn: 'Enter 키를 눌러 돌아가기',
    },
  },
};

// 获取翻译文本的辅助函数
export function useTranslation(language: Language) {
  return translations[language];
}

