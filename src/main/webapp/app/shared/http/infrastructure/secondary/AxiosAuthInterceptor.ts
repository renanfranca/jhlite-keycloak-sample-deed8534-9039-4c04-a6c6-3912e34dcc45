import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { inject } from '@/injections';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';

type SuccessHandler = (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
type ErrorHandler = (error: AxiosError) => Promise<never>;

export const setupAxiosInterceptors = (axios: AxiosInstance): void => {
  const auths = inject(AUTH_REPOSITORY);

  axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    if (await auths.authenticated()) {
      const token = await auths.refreshToken();
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  axios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<never> => {
      if (error.response && error.response.status === 401) {
        await auths.logout();
        //TODO: Redirect to login page or update application state
      }
      return Promise.reject(error);
    }
  );
};
