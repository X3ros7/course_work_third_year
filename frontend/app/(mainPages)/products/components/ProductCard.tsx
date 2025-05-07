import { Product } from '@/types/productTypes';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card key={product.id} className="group overflow-hidden">
      <div className="relative">
        <Image
          src={
            product.images && product.images.length > 0
              ? product.images[0].url
              : '/placeholder.svg?height=300&width=300&text=Album+Front'
          }
          alt={product.name}
          className="w-full h-auto aspect-square object-cover"
          width={800}
          height={800}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0"
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="rounded-full w-10 h-10 p-0"
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-bold text-blue-600">${product.price.toFixed(2)}</p>
        <div className="flex flex-row justify-between">
          <p className="text-sm text-gray-600 font-bold mt-1">
            {product.seller.name}
          </p>
          <p className="text-sm text-gray-600">{product.year}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link href={`/products/${product.id}`}>View Product</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
