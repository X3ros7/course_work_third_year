import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions,
} from 'typeorm';

export class CreateOrders1742712270567 implements MigrationInterface {
  private readonly tableName = 'orders';

  private get modelColumns(): TableColumnOptions[] {
    return [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
      },
    ];
  }

  private get editableColumns(): TableColumnOptions[] {
    return [
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
      },
    ];
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          ...this.modelColumns,
          {
            name: 'product_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'stripe_payment_intent_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'stripe_payment_status',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'delivery_status',
            type: 'varchar',
            isNullable: false,
          },
          ...this.editableColumns,
        ],
        foreignKeys: [
          {
            columnNames: ['product_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'products',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['user_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.tableName);
  }
}
