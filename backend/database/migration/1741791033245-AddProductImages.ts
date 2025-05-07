import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumnOptions,
} from 'typeorm';

export class AddProductImages1741791033245 implements MigrationInterface {
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
    await queryRunner.dropColumn('products', 'image');
    await queryRunner.createTable(
      new Table({
        name: 'product_images',
        columns: [
          ...this._modelColumns,
          { name: 'url', type: 'text', isNullable: false },
          { name: 'product_id', type: 'int', isNullable: false },
          ...this._editableColumns,
        ],
        foreignKeys: [
          {
            columnNames: ['product_id'],
            referencedTableName: 'products',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('product_images');
  }
}
