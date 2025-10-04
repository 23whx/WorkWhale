// 核心显露引擎
export class RevealEngine {
  private buffer: string = '';
  private idx: number = 0;
  private revealed: number[] = [];
  private charsPerKey: number = 1;
  private charsPerSpace: number = 4;

  init(text: string, startIdx: number = 0) {
    this.buffer = text;
    this.idx = startIdx;
    this.revealed = [];
  }

  setConfig(charsPerKey: number, charsPerSpace: number) {
    this.charsPerKey = charsPerKey;
    this.charsPerSpace = charsPerSpace;
  }

  reveal(n: number): string {
    if (this.idx >= this.buffer.length) {
      return '';
    }

    const start = this.idx;
    const end = Math.min(this.idx + n, this.buffer.length);
    const revealed = this.buffer.slice(start, end);
    
    this.idx = end;
    this.revealed.push(end - start);
    
    return revealed;
  }

  revealKey(): string {
    return this.reveal(this.charsPerKey);
  }

  revealSpace(): string {
    return this.reveal(this.charsPerSpace);
  }

  recall(nChunk: number = 1): number {
    while (nChunk > 0 && this.revealed.length > 0) {
      const len = this.revealed.pop()!;
      this.idx = Math.max(0, this.idx - len);
      nChunk--;
    }
    return this.idx;
  }

  getIndex(): number {
    return this.idx;
  }

  getProgress(): number {
    if (this.buffer.length === 0) return 0;
    return (this.idx / this.buffer.length) * 100;
  }

  isAtEnd(): boolean {
    return this.idx >= this.buffer.length;
  }

  getRevealedText(): string {
    return this.buffer.slice(0, this.idx);
  }

  jumpTo(index: number) {
    this.idx = Math.max(0, Math.min(index, this.buffer.length));
    this.revealed = [];
  }
}

