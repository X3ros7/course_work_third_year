'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Bell,
  User,
  Menu,
  X,
  Disc3,
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Edit,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    toast('Logged out', {
      description: 'You have been successfully logged out',
    });
    router.push('/seller/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/seller/dashboard' },
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

export default function SellerProfile() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock seller profile data
  const [sellerData, setSellerData] = useState({
    storeName: 'Vinyl Records Shop',
    ownerName: 'John Smith',
    email: 'contact@vinylrecordsshop.com',
    phone: '+1 (555) 123-4567',
    address: '123 Music Street, Harmony City, HC 12345',
    website: 'www.vinylrecordsshop.com',
    description:
      'Established in 2010, Vinyl Records Shop specializes in premium vinyl records across all genres. We pride ourselves on offering rare finds, limited editions, and high-quality pressings for music enthusiasts and collectors.',
    joinDate: 'January 15, 2020',
    bankName: 'First National Bank',
    accountNumber: '****6789',
    taxId: '12-3456789',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSellerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast('Profile updated', {
        description: 'Your seller profile has been successfully updated',
      });

      setIsEditing(false);
    } catch (error) {
      toast.error('Error', {
        description:
          'There was an error updating your profile. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

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
              <h1 className="text-xl font-bold">Seller Profile</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <span className="font-medium text-sm hidden md:inline-block">
                  {sellerData.storeName}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Store Information</h2>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Details</CardTitle>
                      <CardDescription>
                        Manage your store information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="storeName">Store Name</Label>
                          {isEditing ? (
                            <Input
                              id="storeName"
                              name="storeName"
                              value={sellerData.storeName}
                              onChange={handleChange}
                            />
                          ) : (
                            <div className="mt-1 text-gray-900">
                              {sellerData.storeName}
                            </div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="ownerName">Owner Name</Label>
                          {isEditing ? (
                            <Input
                              id="ownerName"
                              name="ownerName"
                              value={sellerData.ownerName}
                              onChange={handleChange}
                            />
                          ) : (
                            <div className="mt-1 text-gray-900">
                              {sellerData.ownerName}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          {isEditing ? (
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={sellerData.email}
                              onChange={handleChange}
                            />
                          ) : (
                            <div className="mt-1 flex items-center text-gray-900">
                              <Mail className="h-4 w-4 mr-2 text-gray-500" />
                              {sellerData.email}
                            </div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          {isEditing ? (
                            <Input
                              id="phone"
                              name="phone"
                              value={sellerData.phone}
                              onChange={handleChange}
                            />
                          ) : (
                            <div className="mt-1 flex items-center text-gray-900">
                              <Phone className="h-4 w-4 mr-2 text-gray-500" />
                              {sellerData.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        {isEditing ? (
                          <Input
                            id="address"
                            name="address"
                            value={sellerData.address}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="mt-1 flex items-center text-gray-900">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            {sellerData.address}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="website">Website</Label>
                        {isEditing ? (
                          <Input
                            id="website"
                            name="website"
                            value={sellerData.website}
                            onChange={handleChange}
                          />
                        ) : (
                          <div className="mt-1 flex items-center text-gray-900">
                            <Globe className="h-4 w-4 mr-2 text-gray-500" />
                            {sellerData.website}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="description">Store Description</Label>
                        {isEditing ? (
                          <Textarea
                            id="description"
                            name="description"
                            value={sellerData.description}
                            onChange={handleChange}
                            rows={4}
                          />
                        ) : (
                          <div className="mt-1 text-gray-900">
                            {sellerData.description}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Profile</CardTitle>
                      <CardDescription>
                        Your public store information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex justify-center">
                        <div className="h-32 w-32 rounded-full bg-blue-100 flex items-center justify-center">
                          <Disc3 className="h-16 w-16 text-blue-600" />
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="text-center">
                          <Button variant="outline" size="sm">
                            Upload Logo
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            Recommended: 512x512px, PNG or JPG
                          </p>
                        </div>
                      ) : null}

                      <div className="pt-4 border-t">
                        <div className="flex items-center mb-4">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <div className="text-sm text-gray-500">
                              Member Since
                            </div>
                            <div className="font-medium">
                              {sellerData.joinDate}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <Package className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <div className="text-sm text-gray-500">
                              Total Products
                            </div>
                            <div className="font-medium">24 Products</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Store Performance</CardTitle>
                      <CardDescription>Your store metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">
                              Sales Performance
                            </span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: '85%' }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">
                              Customer Satisfaction
                            </span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: '92%' }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-500">
                              Response Rate
                            </span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: '78%' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
