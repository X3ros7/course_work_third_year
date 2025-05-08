'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  DollarSign,
  User,
  Menu,
  X,
  Disc3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Order } from '@/types/orderTypes';
import { getSellerOrders } from '@/services/sellerService';

// Sidebar component for the seller dashboard
const Sidebar = ({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('sellerToken');
    toast('Logged out', {
      description: 'You have been successfully logged out',
    });
    router.push('/');
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/seller/dashboard',
      active: true,
    },
    { icon: Package, label: 'Products', href: '/seller/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/seller/orders' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:z-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link
              href="/seller/dashboard"
              className="flex items-center space-x-2"
            >
              <Disc3 className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">Seller Portal</span>
            </Link>
            <button
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  item.active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default function SellerDashboard() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        return;
      }
      const response = await getSellerOrders(`Bearer ${token}`);
      if (response.code === 200) {
        setOrders(response.data as Order[]);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden mr-2"
                onClick={() => setIsMobileOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/seller/profile"
                className="flex items-center space-x-2"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-sm hidden md:inline-block">
                  Vinyl Records Shop
                </span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Sales
                    </p>
                    <h3 className="text-2xl font-bold">
                      $
                      {orders.reduce(
                        (acc, order) => acc + order.product.price,
                        0,
                      )}
                    </h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">
                    {orders.reduce(
                      (acc, order) => acc + order.product.price,
                      0,
                    )}
                    %
                  </span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Orders
                    </p>
                    <h3 className="text-2xl font-bold">{orders.length}</h3>
                  </div>
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">
                    {orders.length}%
                  </span>
                  <span className="text-gray-500 ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {/* Recent Orders */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Link
                    href="/seller/orders"
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    View all <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {order.user.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ${order.product.price.toFixed(2)}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                            order.deliveryStatus === 'Delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.deliveryStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : order.deliveryStatus === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.deliveryStatus}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <Button
                asChild
                className="h-auto py-6 bg-blue-600 hover:bg-blue-700"
              >
                <Link
                  href="/seller/products/new"
                  className="flex flex-col items-center"
                >
                  <Package className="h-6 w-6 mb-2" />
                  <span>Add New Product</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-6">
                <Link
                  href="/seller/orders"
                  className="flex flex-col items-center"
                >
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  <span>Process Orders</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-6">
                <Link
                  href="/seller/products"
                  className="flex flex-col items-center"
                >
                  <Package className="h-6 w-6 mb-2" />
                  <span>Manage Inventory</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-6">
                <Link
                  href="/seller/profile"
                  className="flex flex-col items-center"
                >
                  <Settings className="h-6 w-6 mb-2" />
                  <span>Update Store Info</span>
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
