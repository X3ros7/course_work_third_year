import { DataSource } from 'typeorm';

import { userSeeds } from './user.seed';

export const runSeeds = async (dataSource: DataSource): Promise<void> => {
  try {
    await userSeeds(dataSource);
    console.log('✅ Seeds completed successfully');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
};
