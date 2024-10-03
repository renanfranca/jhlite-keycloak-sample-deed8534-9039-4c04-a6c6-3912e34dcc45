import { describe, it, expect, beforeEach } from 'vitest';
import type { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { setupAxiosInterceptors } from '@/shared/http/infrastructure/secondary/AxiosAuthInterceptor';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import { provide } from '@/injections';
import sinon from 'sinon';
import type { SinonStub } from 'sinon';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import { stubAxiosInstance } from './AxiosStub';
import type { AxiosStubInstance } from './AxiosStub';
import { AxiosHeaders } from 'axios';

interface MockAuthRepository extends AuthRepository {
  authenticated: SinonStub;
  refreshToken: SinonStub;
  logout: SinonStub;
}

describe('AxiosAuthInterceptor', () => {
  let axiosInstance: AxiosStubInstance;
  let mockAuthRepository: MockAuthRepository;

  beforeEach(() => {
    axiosInstance = stubAxiosInstance();
    mockAuthRepository = {
      currentUser: sinon.stub(),
      login: sinon.stub(),
      logout: sinon.stub(),
      authenticated: sinon.stub(),
      refreshToken: sinon.stub(),
    };
    provide(AUTH_REPOSITORY, mockAuthRepository);
  });

  const setupInterceptors = () => {
    setupAxiosInterceptors(axiosInstance);
  };

  it('should add Authorization header for authenticated requests', async () => {
    mockAuthRepository.authenticated.resolves(true);
    mockAuthRepository.refreshToken.resolves('fake-token');
    setupInterceptors();
    const config: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };

    const interceptedConfig = await axiosInstance.runInterceptors(config);

    expect(mockAuthRepository.authenticated.called).toBe(true);
    expect(mockAuthRepository.refreshToken.called).toBe(true);
    expect(interceptedConfig.headers.get('Authorization')).toBe('Bearer fake-token');
  });

  it('should not add Authorization header for unauthenticated requests', async () => {
    mockAuthRepository.authenticated.resolves(false);
    setupInterceptors();
    const config: InternalAxiosRequestConfig = { headers: new AxiosHeaders() };

    const interceptedConfig = await axiosInstance.runInterceptors(config);

    expect(mockAuthRepository.authenticated.called).toBe(true);
    expect(mockAuthRepository.refreshToken.called).toBe(false);
    expect(interceptedConfig.headers.get('Authorization')).toBeUndefined();
  });

  it('should call logout on 401 response', async () => {
    setupInterceptors();
    const error: AxiosError = {
      response: {
        status: 401,
        data: {},
        statusText: '',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      isAxiosError: true,
      toJSON: () => ({}),
      name: '',
      message: '',
    };
    const responseInterceptor = axiosInstance.interceptors.response.use.args[0][1];

    const interceptorPromise = responseInterceptor(error);

    await expect(interceptorPromise).rejects.toEqual(error);
    expect(mockAuthRepository.logout.called).toBe(true);
  });

  it('should not call logout for non-401 errors', async () => {
    setupInterceptors();
    const error: AxiosError = {
      response: {
        status: 500,
        data: {},
        statusText: 'Internal Server Error',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      },
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Request failed with status code 500',
    };

    const responseInterceptor = axiosInstance.interceptors.response.use.args[0][1];

    await expect(responseInterceptor(error)).rejects.toEqual(error);

    expect(mockAuthRepository.logout.called).toBe(false);
  });

  it('should not call logout for errors without response', async () => {
    setupInterceptors();
    const error: AxiosError = {
      isAxiosError: true,
      toJSON: () => ({}),
      name: 'AxiosError',
      message: 'Network Error',
    };

    const responseInterceptor = axiosInstance.interceptors.response.use.args[0][1];

    await expect(responseInterceptor(error)).rejects.toEqual(error);

    expect(mockAuthRepository.logout.called).toBe(false);
  });

  it('should pass through successful responses without modification', async () => {
    setupInterceptors();

    const mockResponse: AxiosResponse = {
      data: { message: 'Success' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as InternalAxiosRequestConfig,
    };

    const responseInterceptor = axiosInstance.interceptors.response.use.args[0][0];

    const result = await responseInterceptor(mockResponse);

    expect(result).toEqual(mockResponse);
  });
});
