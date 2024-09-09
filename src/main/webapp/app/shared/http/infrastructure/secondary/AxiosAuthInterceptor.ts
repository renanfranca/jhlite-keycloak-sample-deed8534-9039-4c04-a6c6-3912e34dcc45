import axios from 'axios';
import { inject } from '@/injections';
import { AUTH_SERVICE } from '@/auth/application/AuthProvider';

export const setupAxiosInterceptors = (): void => {
  const authService = inject(AUTH_SERVICE);

  axios.interceptors.request.use(async (config) => {
    if (await authService.isAuthenticated()) {
      const token = await authService.refreshToken();
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        await authService.logout();
        //TODO: Redirect to login page or update application state
      }
      return Promise.reject(error);
    }
  );
};
