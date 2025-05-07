import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DEFAULT_TIMEOUT = 10000; // 10 seconds timeout

type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

// Create a custom axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: DEFAULT_TIMEOUT,
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // Don't set default Content-Type as it will be overridden for FormData
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Use the token from the function parameter instead of localStorage
    if (config.headers['Authorization']) {
      return config;
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for handling common errors
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response;
//   },
//   (error: AxiosError) => {
//     const apiError: ApiError = {
//       status: error.response?.status || 0,
//       message: 'API Error',
//       details: error.response?.data,
//     };

//     if (error.code === 'ECONNABORTED') {
//       apiError.status = 408;
//       apiError.message = `Request timeout after ${DEFAULT_TIMEOUT}ms`;
//     } else if (!error.response) {
//       apiError.message = `Network error: ${error.message}`;
//     } else {
//       apiError.message = `API error: ${error.response.statusText}`;
//     }

//     return Promise.reject(apiError);
//   },
// );

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log(originalRequest);
    if (error.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await apiClient.post('/auth/refresh-token'); // refresh token will come from cookies
        const newAccessToken = data.data.token;
        localStorage.setItem('token', newAccessToken);
        apiClient.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

/**
 * GET request
 */
export async function fetchData<T>(url: string, token?: string): Promise<T> {
  const config: AxiosRequestConfig = {};
  if (token) {
    config.headers = { Authorization: token };
  }

  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * POST request
 */
export async function postData<T, D = unknown>(
  url: string,
  data: D,
  token?: string,
): Promise<T> {
  const config: AxiosRequestConfig = {};
  if (token) {
    config.headers = { Authorization: token };
  }

  // If data is FormData, set the correct content type
  if (data instanceof FormData) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'multipart/form-data',
    };
  }

  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}

/**
 * PUT request
 */
export async function putData<T, D = unknown>(
  url: string,
  data: D,
  token?: string,
): Promise<T> {
  const config: AxiosRequestConfig = {};
  if (token) {
    config.headers = { Authorization: token };
  }

  const response = await apiClient.put<T>(url, data, config);
  return response.data;
}

/**
 * DELETE request
 */
export async function deleteData<T>(url: string, token?: string): Promise<T> {
  const config: AxiosRequestConfig = {};
  if (token) {
    config.headers = { Authorization: token };
  }

  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

/**
 * PATCH request with FormData support
 */
export async function patchData<T>(
  url: string,
  data: FormData | Record<string, unknown>,
  token?: string,
): Promise<T> {
  const config: AxiosRequestConfig = {
    headers: {},
  };

  if (token) {
    config.headers['Authorization'] = token;
  }

  // If data is FormData, set the correct content type and remove the default
  if (data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
    // Add this to ensure proper FormData handling
    config.transformRequest = [(data, headers) => data];
  }

  console.log('Patch request config:', {
    url,
    headers: config.headers,
    dataType: data instanceof FormData ? 'FormData' : 'JSON',
    dataEntries:
      data instanceof FormData
        ? Array.from(data.entries()).map(([key, value]) => ({
            key,
            value: value instanceof File ? `File: ${value.name}` : value,
          }))
        : data,
  });

  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
}
