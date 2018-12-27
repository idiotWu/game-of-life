import { CELL_STATE } from './world';

export class Record {
  pattern: CELL_STATE[][][] = null;
  patternSize: number = 0;

  private memory: CELL_STATE[][][] = [];

  constructor(
    public readonly size: number,
    public readonly dataSize: number,
  ) {}

  add(data: CELL_STATE[][]) {
    if (this.memory.length === this.size) {
      this.memory.shift();
    }

    this.memory.push(data);
  }

  getPattern() {
    if (this.pattern) {
      return this.pattern;
    }

    const {
      memory,
    } = this;

    const { length } = memory;
    const latest = memory[length - 1];
    const path: CELL_STATE[][][] = [];

    let hasSame = false;

    for (let i = length - 2; i >= 0; i--) {
      const data = memory[i];

      path.push(data);

      if (this.compare(latest, data)) {
        hasSame = true;
        break;
      }
    }

    if (hasSame) {
      this.pattern = path;
      this.patternSize = path.length;
    }

    return hasSame ? path : null;
  }

  compare(a: CELL_STATE[][], b: CELL_STATE[][]) {
    const {
      dataSize,
    } = this;

    for (let y = 0; y < dataSize; y++) {
      for (let x = 0; x < dataSize; x++) {
        if (a[y][x] !== b[y][x]) {
          return false;
        }
      }
    }

    return true;
  }
}
