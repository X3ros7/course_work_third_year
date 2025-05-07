import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (min: number, max: number) => void;
  yearRange: { min: number; max: number };
  onYearRangeChange: (min: number, max: number) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
  genres: string[];
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  yearRange,
  onYearRangeChange,
  selectedGenre,
  onGenreChange,
  genres,
  onApplyFilters,
  onClearFilters,
}: ProductFiltersProps) => {
  return (
    <div className="w-full md:w-1/4 space-y-6">
      <div>
        <h3 className="font-medium mb-3">Search</h3>
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price:DESC">Price: High to Low</SelectItem>
            <SelectItem value="price:ASC">Price: Low to High</SelectItem>
            <SelectItem value="name:ASC">Name: A to Z</SelectItem>
            <SelectItem value="name:DESC">Name: Z to A</SelectItem>
            <SelectItem value="year:ASC">Year: Old to New</SelectItem>
            <SelectItem value="year:DESC">Year: New to Old</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange.min || ''}
            onChange={(e) =>
              onPriceRangeChange(Number(e.target.value), priceRange.max)
            }
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max"
            value={priceRange.max || ''}
            onChange={(e) =>
              onPriceRangeChange(priceRange.min, Number(e.target.value))
            }
            className="w-full"
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Year Range</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={yearRange.min || ''}
            onChange={(e) =>
              onYearRangeChange(Number(e.target.value), yearRange.max)
            }
            className="w-full"
          />
          <Input
            type="number"
            placeholder="Max"
            value={yearRange.max || ''}
            onChange={(e) =>
              onYearRangeChange(yearRange.min, Number(e.target.value))
            }
            className="w-full"
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Genre</h3>
        <Select value={selectedGenre} onValueChange={onGenreChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onApplyFilters}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Apply Filters
        </Button>
        <Button onClick={onClearFilters} variant="outline" className="flex-1">
          Clear
        </Button>
      </div>
    </div>
  );
};
