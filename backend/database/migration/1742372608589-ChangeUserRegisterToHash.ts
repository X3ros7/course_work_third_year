import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeUserRegisterToHash1742372608589
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable('user_register', 'hash_register');
    await queryRunner.dropColumn('hash_register', 'user_id');
    await queryRunner.addColumn(
      'hash_register',
      new TableColumn({ name: 'hash', type: 'varchar', isNullable: false }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "hash_register" DROP COLUMN "hash"`);
  }
}
