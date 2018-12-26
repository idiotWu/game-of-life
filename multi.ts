import * as ProgressBar from 'progress';

import { fork } from 'child_process';

const options = {
  size: 100,
  initialPercentage: 10,
};

const THREADS = 4;
const WORLD_COUNT = 1e3;
const WORLD_PER_THREADS = WORLD_COUNT / THREADS | 0;

let finished = 0;
let pattern = 0;

const avg: number[] = [];
const vari: number[] = [];

const bar = new ProgressBar('[:bar] :current/:total :elapseds', {
  complete: '=',
  incomplete: ' ',
  total: WORLD_COUNT,
});

console.log(`world size: ${options.size} * ${options.size}`);
console.log(`initial alive cell percentage: ${options.initialPercentage}`);
console.log(`number of worlds: ${WORLD_COUNT}`);
console.log(`threads: ${THREADS}`);

for (let i = 0; i < THREADS; i++) {
  const process = fork('./test.ts');

  process.send({
    options,
    type: 'gof',
    count: WORLD_PER_THREADS,
  });

  process.on('message', (msg) => {
    switch (msg.type) {
      case 'tick':
        return bar.tick();

      case 'stat':
        return analyse(msg.stat);
    }
  });
}

function analyse(stat: any) {
  avg.push(stat.avg);
  vari.push(stat.vari);
  pattern += stat.pattern;
  finished++;

  if (finished === THREADS) {
    const av = avg.reduce((a, b) => a + b) / pattern;

    const sd = Math.sqrt(vari.reduce((a, b) => {
      return a + b;
    }) / pattern);

    console.log(`got pattern: ${pattern}`);
    console.log(`avg = ${av.toFixed(2)}, sd = ${sd.toFixed(2)}`);
  }
}
