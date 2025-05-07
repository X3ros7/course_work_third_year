import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions,
  TableIndex,
} from 'typeorm';

export class Initial1741373633809 implements MigrationInterface {
  name?: string;
  transaction?: boolean;

  get _editableColumns(): TableColumnOptions[] {
    return [
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()',
        onUpdate: 'now()',
      },
    ];
  }

  get _modelColumns(): TableColumnOptions[] {
    return [
      {
        name: 'id',
        type: 'serial',
        isPrimary: true,
      },
    ];
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          ...this._modelColumns,
          {
            name: 'first_name',
            type: 'varchar(128)',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar(128)',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar(128)',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar(128)',
            isNullable: false,
          },
          {
            name: 'role',
            type: 'varchar(24)',
            isNullable: false,
          },
          {
            name: 'is_blocked',
            type: 'boolean',
            default: false,
          },
          ...this._editableColumns,
        ],
      }),
      true,
    );

    await queryRunner.createIndices('users', [
      new TableIndex({
        name: 'users_email_index',
        columnNames: ['email'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const userTable = await queryRunner.getTable('users');
    if (userTable?.indices) {
      await queryRunner.dropIndices('users', userTable.indices);
    }
    await queryRunner.dropTable('users');
  }
}
