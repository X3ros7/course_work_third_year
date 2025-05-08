'use client';

import Link from 'next/link';
import { Disc3, User, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import useUser from '@/hooks/useUser';
import useSeller from '@/hooks/useSeller';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isLoading: isUserLoading } = useUser();
  const { isSeller, isLoading: isSellerLoading } = useSeller();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated (either as user or seller)
    const userToken = localStorage.getItem('token');
    const sellerToken = localStorage.getItem('sellerToken');
    setIsAuthenticated(!!userToken || !!sellerToken);
    setIsLoading(false);
  }, []);

  // Determine what to show in the navigation header
  const showAuthButtons = !isAuthenticated && !isLoading;
  const showUserAvatar = isAuthenticated && user && !isSeller && !isUserLoading;
  const showSellerIcon = isAuthenticated && isSeller && !isSellerLoading;

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Disc3 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">SoundSphere</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium hover:text-blue-600"
          >
            Shop
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {showAuthButtons && (
            <>
              <Link
                href="/sign-up"
                className="text-sm font-medium hover:text-blue-600"
              >
                Sign In
              </Link>
              <Button
                asChild
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Link href="/seller/login">Seller Login</Link>
              </Button>
            </>
          )}

          {showUserAvatar && (
            <Link href="/user/me" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={`${user.firstName}'s avatar`}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <span className="text-sm font-medium">{user.firstName}</span>
            </Link>
          )}

          {showSellerIcon && (
            <Link
              href="/seller/dashboard"
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Store className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Seller Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
