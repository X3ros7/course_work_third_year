'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from './components/ProductCard';
import { ProductFilters } from './components/ProductFilters';
import { useProducts } from './hooks/useProducts';
import { useProductFilters } from './hooks/useProductFilters';

export default function Products() {
  const { products, loading, error, totalItems, fetchProducts, pages } =
    useProducts();
  const [page, setPage] = useState(1);
  const {
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
  } = useProductFilters();

  useEffect(() => {
    fetchProducts(getFilterState());
  }, [sortBy]); // Only refetch when sort changes

  const handleApplyFilters = () => {
    fetchProducts(getFilterState());
  };

  const handleClearFilters = () => {
    resetFilters();
    fetchProducts({
      searchTerm: '',
      sortBy: 'featured',
      priceRange: { min: 0, max: 0 },
      yearRange: { min: 0, max: 0 },
      selectedGenre: 'all',
    });
  };

  // Get unique genres from products
  const genres = Array.from(new Set(products.map((product) => product.genre)));

  const handleNextPage = () => {
    fetchProducts(getFilterState(), page + 1);
    setPage(page + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vinyl Collection</h1>
          <p className="text-gray-600">
            Discover our premium selection of vinyl records
          </p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-sm text-gray-500 mr-2">
            {totalItems} products
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={(min, max) => setPriceRange({ min, max })}
          yearRange={yearRange}
          onYearRangeChange={(min, max) => setYearRange({ min, max })}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
          genres={genres}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
        />

        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg">
              <p>{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-2 bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                No products found matching your criteria
              </p>
              <Button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {products.length < totalItems && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => handleNextPage()}
          >
            Next page
          </Button>
        </div>
      )}
      <div className="flex justify-center">
        <p className="text-gray-600">
          Page {page} of {pages}
        </p>
      </div>
    </div>
  );
}
