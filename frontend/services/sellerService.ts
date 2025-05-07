import { postData, fetchData, deleteData, patchData } from './apiService';
import {
  SellerLoginRequest,
  SellerRegisterRequest,
  SellerAuthResponse,
} from '@/types/sellerTypes';
import { BaseResponse } from '@/types/basicTypes';

export interface ApiResponse {
  success: boolean;
  message: string;
  code: number;
  data: unknown;
}

export async function sellerLogin(request: SellerLoginRequest) {
  const response = await postData<SellerAuthResponse, SellerLoginRequest>(
    '/seller/auth/login',
    request,
  );
  return response;
}

export async function sellerRegister(request: SellerRegisterRequest) {
  const response = await postData<SellerAuthResponse, SellerRegisterRequest>(
    '/seller/auth/register',
    request,
  );
  return response;
}

export async function sellerLogout() {
  const response = await postData<{ message: string }, undefined>(
    '/seller/auth/logout',
    undefined,
  );
  return response;
}

export async function createSellerProduct(
  productData: FormData,
  token: string,
): Promise<BaseResponse> {
  console.log('Sending product data to API:', {
    name: productData.get('name'),
    description: productData.get('description'),
    price: productData.get('price'),
    genre: productData.get('genre'),
    artist: productData.get('artist'),
    year: productData.get('year'),
    trackList: productData.get('trackList'),
    images: productData.getAll('images'),
  });

  const response = await postData<BaseResponse, FormData>(
    '/seller/products',
    productData,
    `Bearer ${token}`,
  );
  return response;
}

export async function getSellerProducts(token: string): Promise<BaseResponse> {
  const response = await fetchData<BaseResponse>('/seller/products', token);
  return response;
}

export async function deleteSellerProduct(
  productId: number,
  token: string,
): Promise<BaseResponse> {
  const response = await deleteData<BaseResponse>(
    `/seller/products/${productId}`,
    token,
  );
  return response;
}

export async function updateSellerProduct(
  productId: number,
  productData: {
    name?: string;
    description?: string;
    price?: number;
    genre?: string;
    artist?: string;
    year?: number;
    trackList?: Array<{
      number: number;
      title: string;
      duration: string;
    }>;
    isActive?: boolean;
  },
  token: string,
): Promise<BaseResponse> {
  console.log('Updating product data:', {
    id: productId,
    data: productData,
  });

  const response = await patchData<BaseResponse>(
    `/seller/products/${productId}`,
    productData,
    `Bearer ${token}`,
  );
  return response;
}

export interface Order {
  id: string;
  user: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  date: string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  deliveryStatus: string;
  stripePaymentStatus: string;
  shippingMethod: string;
  trackingNumber: string;
}

export async function getSellerOrders(
  token: string,
): Promise<ApiResponse & { orders: Order[] }> {
  const response = await fetchData<ApiResponse & { orders: Order[] }>(
    '/seller/orders',
    token,
  );
  return response;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  token?: string,
): Promise<ApiResponse> {
  const response = await patchData<ApiResponse>(
    `/seller/orders/${orderId}`,
    {
      deliveryStatus: status,
      trackingNumber,
    },
    token,
  );
  return response;
}
