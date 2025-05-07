import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UserAvatar1741508069063 implements MigrationInterface {
  name?: string;
  transaction?: boolean;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (!table?.findColumnByName('avatar')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'avatar',
          type: 'text',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    const column = table?.findColumnByName('avatar');
    if (column) {
      await queryRunner.dropColumn('users', column);
    }
  }
}
