import * as commander from 'commander';

import { multiThreads } from './util/multi';

const defaultOptions = {
  outDir: `./stat`,
  threads: 4,
  size: 100,
  count: 1000,
  range: [10, 90],
  step: 10,
};

const toInt = v => parseInt(v, 10);
const toRange = v => v.split('..').map(toInt);

commander
  .version('0.0.1')
  .option('--out-dir <dir>', `Set output directory, default to ${defaultOptions.outDir}`)
  .option('--threads <n>', `Set the number of multi-threads, default is ${defaultOptions.threads}`, toInt)
  .option('--size <n>', `Set world size, default is ${defaultOptions.size}`, toInt)
  .option('--count <n>', `Set the number of worlds, default is ${defaultOptions.count}`, toInt)
  .option('--range <a>..<b>', `Set the range of initial alive cell density, default is ${JSON.stringify(defaultOptions.range)}`, toRange)
  .option('--step <n>', `Set the value to increase initial density by, default is ${defaultOptions.step}`, toInt)
  .parse(process.argv);

const from = (commander.range || defaultOptions.range)[0];
const to = (commander.range || defaultOptions.range)[1];
const step = commander.step || defaultOptions.step;

const options = {
  outDir: commander.outDir || defaultOptions.outDir,
  threads: commander.threads || defaultOptions.threads,
  worldCount: commander.count || defaultOptions.count,
  worldOptions: {
    size: commander.size || defaultOptions.size,
    initialDensity: from,
  },
};

async function run() {
  for (let i = from; i <= to; i += step) {
    const opt = Object.assign({}, options);
    opt.worldOptions.initialDensity = i;
    await multiThreads(opt);
  }
}

run();
