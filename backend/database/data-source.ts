import { DataSource, DataSourceOptions } from 'typeorm';

import config from './config';

export default new DataSource(config as DataSourceOptions);
