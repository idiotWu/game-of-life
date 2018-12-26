import { CELL_STATE } from './world';

const THRESHOLD = 0.999;

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
    const path: CELL_STATE[][][] = [latest];

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
    const { dataSize } = this;

    let sameCell = 0;
    let aliveCount = 0;

    for (let y = 0; y < dataSize; y++) {
      for (let x = 0; x < dataSize; x++) {
        const ca = a[y][x];
        const cb = b[y][x];

        if (ca !== CELL_STATE.ALIVE && cb !== CELL_STATE.ALIVE) {
          continue;
        }

        aliveCount++;

        if (ca === cb) {
          sameCell++;
        }
      }
    }

    const similarity = sameCell / aliveCount;

    return similarity >= THRESHOLD;
  }
}
