import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

apiClient.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response =
        await axios.post<RefreshResponse>(
          '/api/auth/refresh',
          { refreshToken }
        );

      const {
        accessToken,
        refreshToken: newRefreshToken,
      } = response.data.data;

      localStorage.setItem(
        'accessToken',
        accessToken
      );

      localStorage.setItem(
        'refreshToken',
        newRefreshToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;