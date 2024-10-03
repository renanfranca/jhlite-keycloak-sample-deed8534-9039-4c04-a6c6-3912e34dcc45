import type { AxiosInstance, AxiosInterceptorManager, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { SinonStub } from 'sinon';
import sinon from 'sinon';

export interface AxiosStubInterceptorManager extends AxiosInterceptorManager<InternalAxiosRequestConfig> {
  use: SinonStub;
  eject: SinonStub;
  clear: SinonStub;
}

export interface AxiosStubInstance extends AxiosInstance {
  get: SinonStub;
  put: SinonStub;
  post: SinonStub;
  delete: SinonStub;
  interceptors: {
    request: AxiosStubInterceptorManager;
    response: AxiosStubInterceptorManager;
  };
  runInterceptors: (config: InternalAxiosRequestConfig) => Promise<InternalAxiosRequestConfig>;
}

export const stubAxiosInstance = (): AxiosStubInstance => {
  const instance = {
    get: sinon.stub(),
    put: sinon.stub(),
    post: sinon.stub(),
    delete: sinon.stub(),
    interceptors: {
      request: {
        use: sinon.stub(),
        eject: sinon.stub(),
        clear: sinon.stub()
      },
      response: {
        use: sinon.stub(),
        eject: sinon.stub(),
        clear: sinon.stub()
      }
    },
    runInterceptors: async (config: InternalAxiosRequestConfig) => {
      let currentConfig = { ...config, headers: config.headers || {} };
      for (const interceptor of instance.interceptors.request.use.args) {
        currentConfig = await interceptor[0](currentConfig);
      }
      return currentConfig;
    }
  } as AxiosStubInstance;
  return instance;
};

export const dataAxiosResponse = <T>(data: T): AxiosResponse<T> =>
  ({
    data,
  }) as AxiosResponse<T>;
