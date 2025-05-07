'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/productTypes';
import { getFavorites } from '@/services/userService';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import Link from 'next/link';

export default function Favorites() {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await getFavorites();
      const favorites: Product[] = [];

      if (response.code === 200) {
        for (const favorite of response.data) {
          const product = favorite.product;
          favorites.push(product);
        }
        setFavorites(favorites);
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>Favorites</h1>
      <div className="flex flex-col gap-4">
        {favorites.map((favorite) => (
          <Card key={favorite.id}>
            <CardHeader>
              <Link href={`/products/${favorite.id}`}>
                <CardTitle>{favorite.name}</CardTitle>
                <CardDescription>{favorite.price}$</CardDescription>
              </Link>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
