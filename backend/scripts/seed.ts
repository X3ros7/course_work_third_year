import dataSource from '../database/data-source';
import { runSeeds } from '../database/seeds';

const seed = async () => {
  try {
    await dataSource.initialize();
    await runSeeds(dataSource);
    await dataSource.destroy();
    process.exit(0);
  } catch (error: unknown) {
    console.error(
      'Error during seeding:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

seed();
