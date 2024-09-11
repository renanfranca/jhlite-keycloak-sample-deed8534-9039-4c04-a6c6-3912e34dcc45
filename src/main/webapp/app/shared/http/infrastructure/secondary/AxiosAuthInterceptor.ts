import type { AxiosInstance } from 'axios';
import { inject } from '@/injections';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';

export const setupAxiosInterceptors = (axios: AxiosInstance): void => {
  const auths = inject(AUTH_REPOSITORY);

  axios.interceptors.request.use(async (config) => {
    if (await auths.isAuthenticated()) {
      const token = await auths.refreshToken();
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        await auths.logout();
        //TODO: Redirect to login page or update application state
      }
      return Promise.reject(error);
    }
  );
};
