import { fetchData, patchData, postData } from './apiService';
import { BaseResponse } from '@/types/basicTypes';

export async function me() {
  const response = await fetchData<BaseResponse>('/user/me');
  return response;
}

export async function getFavorites() {
  const response = await fetchData<BaseResponse>('/user/favorites');
  return response;
}

export async function getOrders() {
  const response = await fetchData<BaseResponse>('/user/orders');
  return response;
}

export async function changePassword(oldPassword: string, newPassword: string) {
  const response = await postData('/user/change-password', {
    oldPassword,
    newPassword,
  });
  return response;
}

export async function updateUser(user: {
  firstName: string;
  lastName: string;
  avatar?: File | null;
}) {
  const formData = new FormData();
  formData.append('firstName', user.firstName);
  formData.append('lastName', user.lastName);
  if (user.avatar) {
    formData.append('avatar', user.avatar);
  }
  const response = await patchData('/user/update', formData);
  return response;
}
