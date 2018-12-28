import { World } from '../src/world';
import { Record } from '../src/record';

const MAX_GENERATION = 1e4;

process.on('message', ({ type, worldOptions, count }) => {
  if (type !== 'gol') return;

  for (let i = 0; i < count; i++) {
    const world = new World(worldOptions);

    const record = new Record<typeof world.cells>(10, world.size);

    while (world.generation < MAX_GENERATION) {
      record.add(world.next());

      if (record.getPattern()) {
        break;
      }
    }

    process.send({
      type: 'tick',
      generation: world.generation,
      survivalRate: world.getAliveDensity(),
      patternSize: record.patternSize,
    });
  }

  process.exit(0);
});
