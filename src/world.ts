import { shuffle } from 'lodash';

export enum CELL_STATE {
  DEAD,
  ALIVE,
}

type WorldOptions = {
  size?: number,
  initialDensity?: number,
};

const defaultOptions: WorldOptions = {
  size: 100,
  initialDensity: 10,
};

export class World {
  size: number;
  cells: Uint8Array;
  generation: number = 0;

  constructor({
    size = defaultOptions.size,
    initialDensity = defaultOptions.initialDensity,
  }: WorldOptions = defaultOptions) {
    this.init(size, initialDensity);
  }

  next() {
    // use native for-loop to improve performance
    const {
      size,
      cells,
    } = this;

    const next: Uint8Array = new Uint8Array(size * size);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = y * size + x;

        switch (this.aliveNeighbors(x, y)) {
          case 2:
            // stays same state
            next[idx] = cells[idx];
            break;

          case 3:
            // keeps or turns alive
            next[idx] = CELL_STATE.ALIVE;
            break;

          default:
            // otherwise dies
            next[idx] = CELL_STATE.DEAD;
        }
      }
    }

    this.cells = next;
    this.generation++;

    return next;
  }

  getAliveDensity() {
    const {
      size,
      cells,
    } = this;

    let remain: number = 0;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (cells[y * size + x] === CELL_STATE.ALIVE) {
          remain++;
        }
      }
    }

    return remain / (size * size) * 100;
  }

  private init(size: number, initialDensity: number) {
    const total = size * size;
    const alive = (initialDensity / 100) * total | 0;

    const cells: CELL_STATE[] = shuffle(new Array(total - alive)
      .fill(CELL_STATE.DEAD)
      .concat(new Array(alive).fill(CELL_STATE.ALIVE)),
    );

    this.cells = Uint8Array.from(cells);

    this.size = size;
  }

  // index := [0, size-1]
  private normalizeIndex(idx: number) {
    if (idx > this.size - 1) {
      return idx % this.size;
    }

    while (idx < 0) {
      idx += this.size;
    }

    return idx;
  }

  private aliveNeighbors(x: number, y: number) {
    const { size } = this;

    let aliveCount = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // skip self
        if (i === 0 && j === 0) {
          continue;
        }

        const rx = this.normalizeIndex(x + i);
        const ry = this.normalizeIndex(y + j);

        if (this.cells[ry * size + rx] === CELL_STATE.ALIVE) {
          aliveCount++;
        }
      }
    }

    return aliveCount;
  }
}
