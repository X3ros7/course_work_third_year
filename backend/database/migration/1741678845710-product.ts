import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions,
} from 'typeorm';

export class Product1741678845710 implements MigrationInterface {
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

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sellers',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar(255)',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'avatar',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'is_verified',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'is_blocked',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          ...this._editableColumns,
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'products',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal(10, 2)',
            isNullable: false,
          },
          {
            name: 'image',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'genre',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'artist',
            type: 'varchar(255)',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          {
            name: 'seller_id',
            type: 'int',
            isNullable: false,
          },
          ...this._editableColumns,
        ],
        foreignKeys: [
          {
            columnNames: ['seller_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'sellers',
            onDelete: 'CASCADE',
          },
        ],
        checks: [{ columnNames: ['year'], expression: 'year > 1900' }],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('products');
    await queryRunner.dropTable('sellers');
  }
}
