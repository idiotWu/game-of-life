import { shuffle } from 'lodash';

export enum CELL_STATE {
  DEAD,
  ALIVE,
}

type CELL_MAP = CELL_STATE[][];

type WorldOptions = {
  cells?: CELL_MAP,
  size?: number,
  initialPercentage?: number,
};

const defaultOptions: WorldOptions = {
  size: 100,
  initialPercentage: 10,
};

export class World {
  size: number;
  cells: CELL_MAP;
  generation: number = 0;

  constructor({
    cells,
    size = defaultOptions.size,
    initialPercentage = defaultOptions.initialPercentage,
  }: WorldOptions = defaultOptions) {
    if (cells) {
      this.cells = cells;
      this.size = cells.length;
    } else {
      this.init(size, initialPercentage);
    }
  }

  next() {
    // use native for-loop to improve performance
    const {
      size,
      cells,
    } = this;

    const next: CELL_MAP = [];

    for (let y = 0; y < size; y++) {
      const row: CELL_STATE[] = [];
      next.push(row);

      for (let x = 0; x < size; x++) {
        const aliveCount = this.getAliveCount(x, y);
        let state = cells[y][x];

        if (aliveCount < 2 || aliveCount > 3) {
          state = CELL_STATE.DEAD;
        }

        if (aliveCount === 3) {
          state = CELL_STATE.ALIVE;
        }

        row.push(state);
      }
    }

    this.cells = next;
    this.generation++;

    return next;
  }

  private init(size: number, alivePercentage: number) {
    const total = size * size;
    const alive = (alivePercentage / 100) * total | 0;

    const cells1d: CELL_STATE[] = shuffle(new Array(total - alive)
      .fill(CELL_STATE.DEAD)
      .concat(new Array(alive).fill(CELL_STATE.ALIVE)),
    );

    this.cells = Array.from(new Array(size), () => {
      return cells1d.splice(0, size);
    });

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

  private getAliveCount(x: number, y: number) {
    let aliveCount = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }

        const rx = this.normalizeIndex(x + i);
        const ry = this.normalizeIndex(y + j);

        // skip self
        if (this.cells[ry][rx] === CELL_STATE.ALIVE) {
          aliveCount++;
        }
      }
    }

    return aliveCount;
  }
}
