import { World } from './src/world';
import { Record } from './src/record';

process.on('message', ({ type, options, count }) => {
  if (type !== 'gof') return;

  const results: number[] = [];

  for (let i = 0; i < count; i++) {
    const world = new World(options);

    const record = new Record(100, world.size);

    for (let cnt = 1; cnt < 1e4; cnt++) {
      record.add(world.next());

      if (record.getPattern()) {
        results.push(cnt);
        break;
      }
    }

    process.send({ type: 'tick' });
  }

  const avg = results.reduce((a, b) => a + b) / results.length;

  const vari = results.reduce((a, b) => {
    return a + (b - avg) ** 2;
  }, 0);

  process.send({
    type: 'stat',
    stat: {
      avg,
      vari,
      pattern: results.length,
    },
  });
});
