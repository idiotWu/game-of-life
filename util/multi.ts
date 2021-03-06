import * as fs from 'fs';
import * as path from 'path';
import xlsx from 'node-xlsx';
import * as ProgressBar from 'progress';
import { fork, ChildProcess } from 'child_process';

type Options = {
  outDir: string,
  threads: number,
  recordSize: number,
  worldCount: number,

  worldOptions: {
    size?: number,
    initialDensity?: number,
  },
};

export async function multiThreads({
  outDir,
  threads,
  recordSize,
  worldCount,
  worldOptions,
}: Options) {
  const data: any[][] = [
    ['Generation', 'Cell Density', 'Repeating Pattern Size'],
  ];

  const bar = new ProgressBar('[:bar] :current/:total :elapseds', {
    complete: '=',
    incomplete: ' ',
    total: worldCount,
  });

  console.log(`world size: ${worldOptions.size} * ${worldOptions.size}`);
  console.log(`initial density of alive cells: ${worldOptions.initialDensity}%`);
  console.log(`number of worlds: ${worldCount}`);
  console.log(`record size: ${recordSize}`);
  console.log(`threads: ${threads}`);

  const children: Promise<any>[] = [];

  for (let i = 0; i < threads; i++) {
    const promise = forkPromise(path.resolve(__dirname, './task.ts'), (process) => {
      process.send({
        worldOptions,
        recordSize,
        type: 'gol',
        count: worldCount / threads | 0,
      });

      process.on('message', (msg) => {
        if (msg.type !== 'tick') {
          return;
        }

        data.push([msg.generation, msg.density, msg.patternSize]);
        bar.tick();
      });
    });

    children.push(promise);
  }

  await Promise.all(children);

  const filename = `s-${worldOptions.size}-d-${worldOptions.initialDensity}-c-${worldCount}.xlsx`;

  await save(outDir, filename, data);
}

async function forkPromise(
  file: string,
  cb: (process: ChildProcess) => void,
) {
  const process = fork(file);

  cb(process);

  return new Promise((resolve, reject) => {
    process.on('exit', resolve);
    process.on('error', reject);
  });
}

// save results
async function save(outDir: string, filename: string, data: any[][]) {
  const buffer = xlsx.build([{
    data,
    name: 'Results',
  }]);

  await fs.promises.mkdir(outDir, { recursive: true });

  await fs.promises.writeFile(`${outDir}/${filename}`, buffer);

  console.log(`\nsaved results to ${outDir}/${filename}\n\n`);
}
