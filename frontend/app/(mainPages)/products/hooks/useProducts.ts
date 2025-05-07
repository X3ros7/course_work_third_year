import { useState } from 'react';
import { getProducts, type Filter } from '@/services/productsService';
import type { Product } from '@/types/productTypes';

export type FilterState = {
  searchTerm: string;
  sortBy: string;
  priceRange: { min: number; max: number };
  yearRange: { min: number; max: number };
  selectedGenre: string;
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [pages, setPages] = useState(0);

  const fetchProducts = async (filters: FilterState, page: number = 1) => {
    try {
      setLoading(true);
      const activeFilters: Filter[] = [];

      // Name filter
      if (filters.searchTerm) {
        activeFilters.push({
          field: 'name',
          operator: '$ilike',
          value: filters.searchTerm,
        });
      }

      // Price range filter
      if (filters.priceRange.min > 0) {
        activeFilters.push({
          field: 'price',
          operator: '$gte',
          value: filters.priceRange.min,
        });
      }
      if (filters.priceRange.max > 0) {
        activeFilters.push({
          field: 'price',
          operator: '$lte',
          value: filters.priceRange.max,
        });
      }

      // Year range filter
      if (filters.yearRange.min > 0) {
        activeFilters.push({
          field: 'year',
          operator: '$gte',
          value: filters.yearRange.min,
        });
      }
      if (filters.yearRange.max > 0) {
        activeFilters.push({
          field: 'year',
          operator: '$lte',
          value: filters.yearRange.max,
        });
      }

      // Genre filter
      if (filters.selectedGenre && filters.selectedGenre !== 'all') {
        activeFilters.push({
          field: 'genre',
          operator: '$eq',
          value: filters.selectedGenre,
        });
      }

      const response = await getProducts(activeFilters, filters.sortBy, page);
      if (response.code !== 200) {
        throw new Error(response.message || 'Failed to fetch products');
      }
      setProducts(response.data as Product[]);
      setTotalItems(response.meta.totalItems);
      setPages(response.meta.totalPages);
      setError(null);
    } catch (err) {
      setError('An error occurred while fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    totalItems,
    fetchProducts,
    pages,
  };
};
