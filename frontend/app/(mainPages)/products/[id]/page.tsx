'use client';

import {
  addToWishlist,
  buyProduct,
  createReview,
  getProduct,
} from '@/services/productsService';
import type { Product } from '@/types/productTypes';
import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  Star,
  Truck,
  RefreshCw,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import useUser from '@/hooks/useUser';
import { DateTime } from 'luxon';
import { ReviewDialog } from '../components/ReviewDialog';
import { toast } from 'sonner';

export default function ProductPage() {
  const query = useSearchParams();
  const success = query.get('success');
  const cancel = query.get('cancel');

  const { user } = useUser();
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (success) {
      toast.success('Payment successful', {
        description: 'Receipt sent to your email',
      });
    }
    if (cancel) {
      toast.error('Payment failed', {
        description: 'Please try again',
      });
    }
  }, [success, cancel]);

  if (!id || Number.isNaN(Number(id))) {
    redirect('/products');
  }

  const buyNow = async (productId: number) => {
    const response = await buyProduct(productId);
    console.log(response);
    if (response.code === 201) {
      redirect(response.data.url);
    } else {
      setError(response.message || 'Failed to buy product');
    }
  };

  const handleReviewSubmit = async (rating: number, review: string) => {
    const response = await createReview(Number(id), rating, review);

    if (response.code === 201) {
      setProduct({
        ...product,
        reviews: product?.reviews.map((review) =>
          review.id === response.data.id ? response.data : review,
        ),
      });
    } else {
      setError(response.message || 'Failed to create review');
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    const response = await addToWishlist(productId);
    if (response.code === 201) {
      if (response.data.status === 'added') {
        toast.success('Product added to wishlist');
      } else {
        toast.error('Product removed from wishlist');
      }
    } else {
      setError(response.message || 'Failed to add product to wishlist');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProduct(Number(id));
        if (response.code === 200) {
          setProduct(response.data as Product);
          setActiveImage(0);
        } else {
          setError(response.message || 'Failed to fetch product');
        }
      } catch (err) {
        setError('An error occurred while fetching the product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Placeholder images for the product
  const productImages = product?.images.map((image) => image.url) || [];
  const avgRating =
    product?.reviews.reduce((acc, review) => acc + review.rating, 0) /
    product?.reviews.length;

  const userReview = product?.reviews.find(
    (review) => review.user.id === user?.id,
  );

  const isReviewed = userReview !== undefined;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="bg-red-100 text-red-800 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Error Loading Product</h2>
          <p>{error}</p>
          <Button
            onClick={() => router.push('/products')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Return to Products
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="bg-yellow-100 text-yellow-800 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p>
            The product you`re looking for doesn`t exist or has been removed.
          </p>
          <Button
            onClick={() => router.push('/products')}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/products" className="hover:text-blue-600">
          Products
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-white">
            <Image
              src={productImages[activeImage] || '/placeholder.svg'}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
              width={800}
              height={800}
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`border rounded-md overflow-hidden ${
                  activeImage === index ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <Image
                  src={image || '/placeholder.svg'}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-auto aspect-square object-cover"
                  width={100}
                  height={100}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center mb-2">
              {DateTime.fromISO(product.createdAt) >
                DateTime.now().minus({ days: 7 }) && (
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                  <span className="text-xs font-semibold">New Product</span>
                </Badge>
              )}
              <div className="ml-auto flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < avgRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  {product.reviews.length} review
                  {product.reviews.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl font-bold text-blue-600 mt-2">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <p className="text-gray-600">
            {product.description ||
              "Limited edition vinyl pressing featuring remastered audio from the original studio recordings. This collector's item includes a gatefold sleeve with exclusive artwork and liner notes."}
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-1/3 text-gray-500">Format:</div>
              <div>12&quot; Vinyl, 180g</div>
            </div>
            <div className="flex items-center">
              <div className="w-1/3 text-gray-500">Release Year:</div>
              <div>{product.year}</div>
            </div>
            <div className="flex items-center">
              <div className="w-1/3 text-gray-500">Seller:</div>
              <div>{product.seller.name}</div>
            </div>
            <div className="flex items-center">
              <div className="w-1/3 text-gray-500">Availability:</div>
              {product.isActive ? (
                <div className="text-green-600 font-medium">In Stock</div>
              ) : (
                <div className="text-red-600 font-medium">Out of Stock</div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => buyNow(product.id)}
                className="bg-blue-600 hover:bg-blue-700 flex-1 disabled:opacity-50"
                disabled={!product.isActive}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.isActive ? 'Buy Now' : 'Product sold'}
              </Button>
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => handleAddToWishlist(product.id)}
              >
                <Heart className="mr-2 h-4 w-4" />
                Add to Wishlist
              </Button>
              <Button variant="outline" className="border-gray-300 sm:w-auto">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm">Free shipping over $50</span>
            </div>
            <div className="flex items-center">
              <RefreshCw className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm">30-day returns</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full justify-start border-b pb-px mb-6">
            <TabsTrigger value="details" className="text-base">
              Details
            </TabsTrigger>
            {product.trackList && product.trackList.length > 0 && (
              <TabsTrigger value="tracklist" className="text-base">
                Tracklist
              </TabsTrigger>
            )}
            <TabsTrigger value="reviews" className="text-base">
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <p>{product.description}</p>
          </TabsContent>
          <TabsContent value="tracklist" className="space-y-4">
            <h3 className="text-lg font-semibold">Tracklist</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
                <div className="border-b border-dashed border-gray-300"></div>
              </div>
              {product.trackList &&
                product.trackList.map((track, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[auto_1fr_auto] gap-4 items-center"
                  >
                    <div className="text-gray-500">{index + 1}.</div>
                    <div>{track.title}</div>
                    <div className="text-gray-500">{track.duration}</div>
                  </div>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Customer Reviews</h3>
            </div>

            <ReviewDialog
              product={product}
              isReviewed={isReviewed || false}
              userReview={userReview || undefined}
              onSubmit={handleReviewSubmit}
            />

            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < avgRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-lg font-medium">{avgRating} out of 5</span>
              <span className="text-gray-500 ml-2">
                ({product.reviews.length} review
                {product.reviews.length > 1 ? 's' : ''})
              </span>
            </div>

            {product.reviews.map((review, index) => (
              <div key={index} className="border-t pt-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">
                      {review.user.firstName} {review.user.lastName}
                    </h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div></div>
                    <div>{review.createdAt.split('T')[0]}</div>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{review.comment}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
