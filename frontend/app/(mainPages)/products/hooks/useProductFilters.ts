import { useState } from 'react';
import type { FilterState } from './useProducts';

export const useProductFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [yearRange, setYearRange] = useState<{ min: number; max: number }>({
    min: 0,
    max: 0,
  });
  const [selectedGenre, setSelectedGenre] = useState<string>('all');

  const getFilterState = (): FilterState => ({
    searchTerm,
    sortBy,
    priceRange,
    yearRange,
    selectedGenre,
  });

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange({ min: 0, max: 0 });
    setYearRange({ min: 0, max: 0 });
    setSelectedGenre('all');
    setSortBy('featured');
  };

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    yearRange,
    setYearRange,
    selectedGenre,
    setSelectedGenre,
    getFilterState,
    resetFilters,
  };
};
