import {
  LoginRequest,
  RegisterRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ResendVerificationEmailRequest,
} from '@/types/authTypes';
import { BaseResponse } from '@/types/basicTypes';

import { postData } from './apiService';

export async function login(request: LoginRequest) {
  const response = await postData<BaseResponse, LoginRequest>(
    '/auth/login',
    request,
  );
  return response;
}

export async function register(request: RegisterRequest) {
  const response = await postData<BaseResponse, RegisterRequest>(
    '/auth/register',
    request,
  );
  return response;
}

export async function verifyEmail(request: VerifyEmailRequest) {
  const response = await postData<BaseResponse, VerifyEmailRequest>(
    '/auth/verify-email',
    request,
  );
  return response;
}

export async function resendVerificationEmail(
  request: ResendVerificationEmailRequest,
) {
  const response = await postData<BaseResponse, ResendVerificationEmailRequest>(
    '/auth/resend-email',
    request,
  );
  return response;
}

export async function forgotPassword(request: ForgotPasswordRequest) {
  const response = await postData<BaseResponse, ForgotPasswordRequest>(
    '/auth/forgot-password',
    request,
  );
  return response;
}

export async function resetPassword(request: ResetPasswordRequest) {
  const response = await postData<BaseResponse, ResetPasswordRequest>(
    '/auth/reset-password',
    request,
  );
  return response;
}

export async function logout() {
  const response = await postData<BaseResponse, undefined>(
    '/auth/logout',
    undefined,
  );
  return response;
}
