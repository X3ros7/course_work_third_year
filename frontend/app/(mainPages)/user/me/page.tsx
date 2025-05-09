'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useUser from '../../../../hooks/useUser';
import {
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Heart,
  Disc3,
  Loader2,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { getFavorites } from '@/services/userService';
import { Product } from '@/types/productTypes';
import useOrders from './hooks/useOrders';
import { Order } from '@/types/orderTypes';

export default function Me() {
  const { user, isLoading } = useUser();
  const { orders } = useOrders();
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    setRecentOrders(orders);
    const getWishlistItems = async () => {
      const res = await getFavorites();
      setWishlistItems(res.data as Product[]);
    };
    console.log(orders);
    getWishlistItems();
  }, [orders]);

  const avatarSrc =
    user?.avatar && user.avatar.trim() !== ''
      ? user.avatar
      : '/default-avatar.png';

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  // Mock data for the profile page
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg">
              <div className="relative h-full w-full rounded-full overflow-hidden">
                <Image
                  src={avatarSrc || '/placeholder.svg'}
                  alt={`${user?.firstName}'s avatar`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md"
              asChild
            >
              <Link href="/user/edit">
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
              {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex flex-col md:flex-row gap-4 md:items-center text-blue-100">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{user?.email || 'user@example.com'}</span>
              </div>
              <div className="hidden md:block h-1 w-1 rounded-full bg-blue-200"></div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Member since {memberSince}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              asChild
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 border-none text-white"
            >
              <Link href="/user/edit">Edit Profile</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{recentOrders.length}</div>
            <div className="text-sm text-blue-100">Orders</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{wishlistItems.length}</div>
            <div className="text-sm text-blue-100">Wishlist</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold"></div>
            <div className="text-sm text-blue-100">Reviews</div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-white border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>
                  Your recent purchases from SoundSphere
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center mb-3 sm:mb-0">
                          <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                            {order.product.images &&
                            order.product.images.length > 0 ? (
                              <Image
                                src={order.product.images[0].url}
                                alt={order.product.name}
                                width={64}
                                height={64}
                                loading="lazy"
                                className="rounded-md object-cover"
                              />
                            ) : (
                              <Disc3 className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">Order {order.id}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )}
                            </div>
                            <div className="flex items-center mt-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  order.deliveryStatus === 'delivered'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : order.deliveryStatus === 'pending'
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                                }`}
                              >
                                {order.deliveryStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${Number(order.product.price).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Payment:{' '}
                            <span
                              className={`font-medium ${
                                order.stripePaymentStatus === 'succeeded'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {order.stripePaymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      No orders yet
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                )}

                {recentOrders.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All Orders
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6 items-center">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Full Name</div>
                        <div className="font-medium">
                          {user?.firstName} {user?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium">
                          {user?.email || 'user@example.com'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-6 border-blue-200 text-blue-600 hover:bg-blue-50"
                    asChild
                  >
                    <Link href="/user/edit">Edit Information</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and manage your orders</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-6">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b">
                        <div>
                          <div className="flex items-center">
                            <h3 className="font-medium">Order {order.id}</h3>
                            <Badge
                              variant="outline"
                              className={`ml-3 text-xs ${
                                order.deliveryStatus === 'delivered'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : order.deliveryStatus === 'pending'
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {order.deliveryStatus}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Placed on{' '}
                            {new Date(order.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <div className="text-right">
                            <div className="font-medium">
                              ${Number(order.product.price).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500">
                              Payment Status:{' '}
                              <span
                                className={`font-medium ${
                                  order.stripePaymentStatus === 'succeeded'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {order.stripePaymentStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div className="flex items-center mb-4 sm:mb-0">
                            <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                              {order.product.images &&
                              order.product.images.length > 0 ? (
                                <Image
                                  src={order.product.images[0].url}
                                  alt={order.product.name}
                                  width={80}
                                  height={80}
                                  loading="lazy"
                                  className="rounded-md object-cover"
                                />
                              ) : (
                                <Disc3 className="h-10 w-10 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-lg">
                                {order.product.name}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                {order.product.seller?.name || 'Unknown Artist'}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Review
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No orders yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start shopping to see your orders here
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Items you`ve saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlistItems.length > 0 ? (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="h-20 w-20 bg-gray-100 rounded-md flex items-center justify-center mr-4">
                        <Image
                          src={
                            item.images && item.images.length > 0
                              ? item.images[0].url
                              : '/placeholder.svg'
                          }
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-blue-600 font-bold mt-1">
                          {item.price.toFixed(2)}$
                        </p>
                        <div className="flex items-center mt-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.isActive
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            } mr-2`}
                          >
                            {item.isActive ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Add to Cart
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Save items you`re interested in for later
                  </p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
