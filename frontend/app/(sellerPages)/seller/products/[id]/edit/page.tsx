'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Bell,
  User,
  Menu,
  X,
  Disc3,
  ArrowLeft,
  Upload,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { updateSellerProduct } from '@/services/sellerService';
import { fetchData } from '@/services/apiService';
import { BaseResponse } from '@/types/basicTypes';
import { Product, Track } from '@/types/productTypes';
import { use } from 'react';

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
    {
      icon: Package,
      label: 'Products',
      href: '/seller/products',
      active: true,
    },
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

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = use(params).id;
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    genre: '',
    artist: '',
    year: '',
    description: '',
  });
  const [trackList, setTrackList] = useState<
    Array<{ number: string; title: string; duration: string }>
  >([]);
  const [newTrack, setNewTrack] = useState({
    number: '',
    title: '',
    duration: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('sellerToken');
      const response = await fetchData<
        BaseResponse & { data: Product & { artist: string } }
      >(`/seller/products/${productId}`, `Bearer ${token}`);

      if (response.data) {
        setProductData({
          name: response.data.name,
          price: response.data.price.toString(),
          genre: response.data.genre,
          artist: response.data.artist,
          year: response.data.year.toString(),
          description: response.data.description || '',
        });
        // Convert Track[] to the form's track list format
        setTrackList(
          response.data.trackList.map((track, index) => ({
            number: (index + 1).toString(),
            title: track.title,
            duration: track.duration,
          })) || [],
        );
        setExistingImages(response.data.images?.map((img) => img.url) || []);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error', {
        description: 'Failed to load product details. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTrack = () => {
    if (newTrack.number && newTrack.title && newTrack.duration) {
      setTrackList([...trackList, newTrack]);
      setNewTrack({ number: '', title: '', duration: '' });
    }
  };

  const handleRemoveTrack = (index: number) => {
    const updatedTracks = [...trackList];
    updatedTracks.splice(index, 1);
    setTrackList(updatedTracks);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log('Files selected:', e.target.files);
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('sellerToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create data object matching the UpdateProductDto structure
      const updateData = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        genre: productData.genre,
        artist: productData.artist,
        year: parseInt(productData.year),
        trackList: trackList.map((track, index) => ({
          number: parseInt(track.number),
          title: track.title,
          duration: track.duration,
        })),
        isActive: true,
      };

      console.log('Sending update data:', updateData);

      const response = await updateSellerProduct(
        parseInt(productId),
        updateData,
        token,
      );
      console.log('Update response:', response);

      toast.success('Product updated', {
        description: 'Your product has been successfully updated',
      });

      router.push('/seller/products');
    } catch (error: unknown) {
      console.error('Error updating product:', error);
      toast.error('Error', {
        description:
          error instanceof Error
            ? error.message
            : 'There was an error updating the product. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
              <h1 className="text-xl font-bold">Edit Product</h1>
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
          <div className="mb-6">
            <Button
              variant="ghost"
              asChild
              className="text-gray-500 hover:text-gray-700 p-0"
            >
              <Link href="/seller/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={productData.name}
                          onChange={handleChange}
                          placeholder="Enter product name"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="artist">Artist</Label>
                          <Input
                            id="artist"
                            name="artist"
                            value={productData.artist}
                            onChange={handleChange}
                            placeholder="e.g. Bring Me The Horizon"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="genre">Genre</Label>
                          <Select
                            value={productData.genre}
                            onValueChange={(value) =>
                              handleSelectChange('genre', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select genre" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Rock">Rock</SelectItem>
                              <SelectItem value="Jazz">Jazz</SelectItem>
                              <SelectItem value="Classical">
                                Classical
                              </SelectItem>
                              <SelectItem value="Electronic">
                                Electronic
                              </SelectItem>
                              <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                              <SelectItem value="Indie">Indie</SelectItem>
                              <SelectItem value="Blues">Blues</SelectItem>
                              <SelectItem value="Metalcore">
                                Metalcore
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price ($)</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={productData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="year">Release Year</Label>
                          <Input
                            id="year"
                            name="year"
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={productData.year}
                            onChange={handleChange}
                            placeholder="e.g. 2013"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={productData.description}
                          onChange={handleChange}
                          placeholder="Enter product description"
                          rows={5}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/seller/products')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Product'
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Product Image Upload */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Product Images</h3>
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-4">
                        Drag and drop your images here, or click to browse
                      </p>
                      <Button variant="outline" size="sm">
                        Upload Images
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        Existing images:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {existingImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square"
                          >
                            <img
                              src={image}
                              alt={`Product image ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setExistingImages(
                                  existingImages.filter((_, i) => i !== index),
                                );
                              }}
                              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        New images to upload:
                      </p>
                      <ul className="space-y-1">
                        {selectedFiles.map((file, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-center justify-between"
                          >
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = [...selectedFiles];
                                newFiles.splice(index, 1);
                                setSelectedFiles(newFiles);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-4">
                    Supported formats: JPG, PNG, WEBP. Maximum file size: 5MB.
                  </p>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-6">
                  <h3 className="font-medium mb-4">Track List</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <Label htmlFor="trackNumber">#</Label>
                        <Input
                          id="trackNumber"
                          value={newTrack.number}
                          onChange={(e) =>
                            setNewTrack({ ...newTrack, number: e.target.value })
                          }
                          placeholder="#"
                        />
                      </div>
                      <div className="col-span-6">
                        <Label htmlFor="trackTitle">Title</Label>
                        <Input
                          id="trackTitle"
                          value={newTrack.title}
                          onChange={(e) =>
                            setNewTrack({ ...newTrack, title: e.target.value })
                          }
                          placeholder="Track title"
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor="trackDuration">Duration</Label>
                        <Input
                          id="trackDuration"
                          value={newTrack.duration}
                          onChange={(e) =>
                            setNewTrack({
                              ...newTrack,
                              duration: e.target.value,
                            })
                          }
                          placeholder="0:00"
                        />
                      </div>
                      <div className="col-span-1 flex items-end">
                        <Button
                          type="button"
                          size="icon"
                          onClick={handleAddTrack}
                          className="h-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {trackList.length > 0 && (
                      <div className="mt-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 w-12">#</th>
                              <th className="text-left py-2">Title</th>
                              <th className="text-left py-2 w-24">Duration</th>
                              <th className="w-10"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {trackList.map((track, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2">{track.number}</td>
                                <td className="py-2">{track.title}</td>
                                <td className="py-2">{track.duration}</td>
                                <td className="py-2">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveTrack(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
