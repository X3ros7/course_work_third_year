import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class UserIsVerified1741436277269 implements MigrationInterface {
  name?: string;
  transaction?: boolean;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    if (!table?.findColumnByName('is_verified')) {
      await queryRunner.addColumn(
        'users',
        new TableColumn({
          name: 'is_verified',
          type: 'boolean',
          isNullable: false,
          default: false,
        }),
      );
    }

    await queryRunner.createTable(
      new Table({
        name: 'user_register',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
            unsigned: true,
          },
          {
            name: 'code',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');

    const column = table?.findColumnByName('is_verified');
    if (column) {
      await queryRunner.dropColumn('users', column);
    }

    await queryRunner.dropTable('user_register');
  }
}
