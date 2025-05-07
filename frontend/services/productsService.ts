import { BaseResponse } from '@/types/basicTypes';
import { fetchData, postData } from './apiService';

export type FilterOperator =
  | '$eq'
  | '$in'
  | '$ilike'
  | '$btw'
  | '$gte'
  | '$lte'
  | '$not';

export type FilterField =
  | 'name'
  | 'createdAt'
  | 'year'
  | 'price'
  | 'genre'
  | 'seller.name';

export type Filter = {
  field: FilterField;
  operator: FilterOperator;
  value: string | number | [number, number];
};

export async function getProducts(
  filters?: Filter[],
  sortBy?: string,
  page?: number,
  limit?: number,
) {
  const baseUrl = '/products';
  const queryParams = new URLSearchParams();

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      const filterValue = Array.isArray(filter.value)
        ? filter.value.join(',')
        : filter.value;
      queryParams.append(
        `filter.${filter.field}`,
        `${filter.operator}:${filterValue}`,
      );
    });
  }

  if (sortBy) {
    queryParams.append('sortBy', sortBy);
  }
  if (page) {
    queryParams.append('page', page.toString());
  }
  if (limit) {
    queryParams.append('limit', limit.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const response = await fetchData<BaseResponse>(url);
  return response;
}

export async function getProduct(id: number) {
  const response = await fetchData<BaseResponse>(`/products/${id}`);
  return response;
}

export async function buyProduct(productId: number) {
  const response = await postData<BaseResponse>(
    `/products/${productId}/buy`,
    {},
  );
  return response;
}

export async function createReview(
  productId: number,
  rating: number,
  review: string,
) {
  const response = await postData<BaseResponse>(
    `/products/${productId}/review`,
    { rating, comment: review },
  );
  return response;
}

export async function addToWishlist(productId: number) {
  const response = await postData<BaseResponse>(
    `/products/${productId}/favorite`,
    {},
  );
  return response;
}
