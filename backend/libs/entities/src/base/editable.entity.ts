import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Editable {
  @CreateDateColumn({
    name: 'created_at',
    default: 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: 'now()',
    onUpdate: 'now()',
  })
  updatedAt: Date;
}
