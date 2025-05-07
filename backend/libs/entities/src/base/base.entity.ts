import { PrimaryGeneratedColumn } from 'typeorm';

import { Editable } from './editable.entity';

export abstract class Model extends Editable {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;
}
