import { Model } from '@app/entities/base/base.entity';
import { PaginateConfig } from 'nestjs-paginate';

export const PaginationConfig: PaginateConfig<Model> = {
  sortableColumns: ['id', 'createdAt', 'updatedAt'],
};
