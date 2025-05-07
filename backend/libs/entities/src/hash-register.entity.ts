import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'hash_register' })
export class HashRegister {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  hash: string;

  @Column()
  code: number;

  @CreateDateColumn({ name: 'created_at', default: 'now()' })
  createdAt: Date;
}
