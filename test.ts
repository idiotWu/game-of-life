import * as ProgressBar from 'progress';

import { World } from './src/world';
import { Record } from './src/record';

const WORLD_COUNT = 1e3;
const bar = new ProgressBar('[:bar] :current/:total :elapseds', {
  complete: '=',
  incomplete: ' ',
  total: WORLD_COUNT,
});

const options = {
  size: 100,
  initialPercentage: 10,
};

const results: number[] = [];

console.log(`world size: ${options.size} * ${options.size}`);
console.log(`initial alive cell percentage: ${options.initialPercentage}`);
console.log(`number of worlds: ${WORLD_COUNT}`);

for (let i = 0; i < WORLD_COUNT; i++) {
  const world = new World(options);

  const record = new Record(100, world.size);

  for (let cnt = 1; cnt < 1e4; cnt++) {
    record.add(world.next());

    if (record.getPattern()) {
      results.push(cnt);
      break;
    }
  }

  bar.tick();
}

const avg = results.reduce((a, b) => a + b) / results.length;

const sd = Math.sqrt(results.reduce((a, b) => {
  return a + (b - avg) ** 2;
}, 0) / results.length);

console.log(`got pattern: ${results.length}`);
console.log(`avg = ${avg.toFixed(2)}, sd = ${sd.toFixed(2)}`);
