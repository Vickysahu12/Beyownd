import axios from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

// IMPORTANT: Apne laptop ka local IP daal (jaise ipconfig se mila tha).
// Phone se "localhost" resolve nahi hota — laptop ka LAN IP hi chalega.
// Jab production mein jayega, isko Render URL se replace karna:
// e.g. "https://beyownd-api.onrender.com/api/v1"
const BASE_URL = 'http://10.83.143.220:5000/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: har request mein access token attach karo ──
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ── Response interceptor: 401 aane par refresh token se retry karo ──
// Multiple requests ek saath 401 de sakte hain (jaise screen load pe 3 API
// calls parallel gayi) — isliye ek queue rakhi hai taaki refresh sirf
// EK BAAR ho, aur baaki saari waiting requests usi naye token ka use karein.
let isRefreshing = false;
let pendingRequests = [];

function resolvePendingRequests(newAccessToken) {
  pendingRequests.forEach((cb) => cb(newAccessToken));
  pendingRequests = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Auth endpoints ke apne 401 errors ko refresh-retry logic se bilkul door rakho
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup');

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) throw new Error('No refresh token available');

      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.data;

      useAuthStore.getState().setTokens(newAccessToken, newRefreshToken);
      resolvePendingRequests(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      pendingRequests = [];
      useAuthStore.getState().logout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);