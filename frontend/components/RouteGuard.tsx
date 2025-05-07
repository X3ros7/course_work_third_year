'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface RouteGuardProps {
  children: ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Define your protected paths
  const protectedPaths = ['/user', '/user/me', '/user/favorites', '/products'];

  // Define auth paths (pages that should not be accessible when authenticated)
  const authPaths = ['/sign-up', '/sign-in', '/login', '/forgot-password'];

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      const isAuthenticated = !!token;

      const isProtectedPath = protectedPaths.some(
        (path) => pathname === path || pathname?.startsWith(`${path}/`),
      );

      const isAuthPath = authPaths.some(
        (path) => pathname === path || pathname?.startsWith(`${path}/`),
      );

      // If trying to access a protected page without being authenticated
      if (isProtectedPath && !isAuthenticated) {
        setIsAuthorized(false);
        router.push('/sign-up');
      }
      // If trying to access an auth page while being authenticated
      else if (isAuthPath && isAuthenticated) {
        setIsAuthorized(false);
        router.push('/user/me');
      }
      // For all other cases, user is authorized to view the page
      else {
        setIsAuthorized(true);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state or nothing while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only render the children when authorized
  return isAuthorized ? <>{children}</> : null;
}
