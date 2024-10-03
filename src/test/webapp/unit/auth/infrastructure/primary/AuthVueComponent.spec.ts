import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import { provide } from '@/injections';
import sinon from 'sinon';
import type { SinonStub } from 'sinon';
import type { AuthRepository } from "@/auth/domain/AuthRepository";

interface MockAuthRepository extends AuthRepository {
  currentUser: SinonStub;
  login: SinonStub;
  logout: SinonStub;
  authenticated: SinonStub;
  refreshToken: SinonStub;
}

const mockAuthRepository: MockAuthRepository = {
  currentUser: sinon.stub(),
  login: sinon.stub(),
  logout: sinon.stub(),
  authenticated: sinon.stub(),
  refreshToken: sinon.stub(),
};

const wrap = () => {
  provide(AUTH_REPOSITORY, mockAuthRepository);
  return mount(AuthVue);
};

const componentVm = (wrapper: VueWrapper) =>
  wrapper.findComponent(AuthVue).vm;

describe('AuthVue', () => {
  let wrapper: VueWrapper;
  let consoleErrorSpy: any;

  beforeEach(async () => {
    mockAuthRepository.authenticated.reset();
    mockAuthRepository.currentUser.reset();
    mockAuthRepository.login.reset();

    mockAuthRepository.authenticated.resolves(false);
    mockAuthRepository.currentUser.resolves({ isAuthenticated: false, username: '', token: '' });

    wrapper = wrap();
    await flushPromises();

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render login button when user is not authenticated', async () => {
    expect(wrapper.find('button').text()).toBe('Login');
  });

  it('should render logout button and username when user is authenticated', async () => {
    mockAuthRepository.authenticated.resolves(true);
    mockAuthRepository.currentUser.resolves({ isAuthenticated: true, username: 'test', token: 'token' });

    wrapper = wrap();
    await flushPromises();

    expect(wrapper.find('p').text()).toBe('Welcome, test!');
    expect(wrapper.find('button').text()).toBe('Logout');
  });

  describe('Login', () => {
    it('should handle failed login attempt', async () => {
      mockAuthRepository.login.rejects(new Error('Login failed'));

      await wrapper.find('button').trigger('click');
      await flushPromises();

      expect(mockAuthRepository.login.called).toBe(true);
      expect(componentVm(wrapper).isLoading).toBe(false);
      expect(componentVm(wrapper).user).toBeNull();
      expect(wrapper.find('button').text()).toBe('Login');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed:', expect.any(Error));
    });

    it('should handle successful login attempt', async () => {
      mockAuthRepository.login.resolves();
      mockAuthRepository.authenticated.resolves(true);
      mockAuthRepository.currentUser.resolves({ isAuthenticated: true, username: 'test', token: 'token' });

      await wrapper.find('button').trigger('click');
      await flushPromises();

      expect(mockAuthRepository.login.called).toBe(true);
      expect(componentVm(wrapper).isLoading).toBe(false);
      expect(wrapper.find('p').text()).toBe('Welcome, test!');
      expect(wrapper.find('button').text()).toBe('Logout');
    });

    it('should set isLoading to true during login process', async () => {
      mockAuthRepository.login.resolves();
      mockAuthRepository.authenticated.resolves(true);
      mockAuthRepository.currentUser.resolves({ isAuthenticated: true, username: 'test', token: 'token' });

      const loginPromise = componentVm(wrapper).login();
      expect(componentVm(wrapper).isLoading).toBe(true);

      await loginPromise;
      await flushPromises();

      expect(componentVm(wrapper).isLoading).toBe(false);
    });

    it('should set user to null when currentUser is not authenticated after login', async () => {
      mockAuthRepository.login.resolves();
      mockAuthRepository.currentUser.resolves({ isAuthenticated: false, username: '', token: '' });

      await wrapper.find('button').trigger('click');
      await flushPromises();

      expect(mockAuthRepository.login.called).toBe(true);
      expect(componentVm(wrapper).user).toBeNull();
      expect(wrapper.find('button').text()).toBe('Login');
    });
  });

  describe('Logout', () => {
    it('should handle successful logout', async () => {
      mockAuthRepository.logout.resolves(true);
      mockAuthRepository.authenticated.resolves(false);

      await componentVm(wrapper).logout();
      await flushPromises();

      expect(mockAuthRepository.logout.called).toBe(true);
      expect(componentVm(wrapper).isLoading).toBe(false);
      expect(componentVm(wrapper).user).toBeNull();
      expect(wrapper.find('button').text()).toBe('Login');
    });

    it('should handle failed logout attempt', async () => {
      const error = new Error('Logout failed');
      mockAuthRepository.logout.rejects(error);

      await componentVm(wrapper).logout();
      await flushPromises();

      expect(mockAuthRepository.logout.called).toBe(true);
      expect(componentVm(wrapper).isLoading).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout failed:', error);
    });

    it('should set isLoading to true during logout process', async () => {
      mockAuthRepository.logout.resolves(true);
      const logoutPromise = componentVm(wrapper).logout();
      expect(componentVm(wrapper).isLoading).toBe(true);

      await logoutPromise;
      await flushPromises();

      expect(componentVm(wrapper).isLoading).toBe(false);
    });

    it('should set user to null after successful logout', async () => {
      mockAuthRepository.logout.resolves(true);
      componentVm(wrapper).user = { isAuthenticated: true, username: 'test', token: 'token' };

      await componentVm(wrapper).logout();
      await flushPromises();

      expect(componentVm(wrapper).user).toBeNull();
    });

    it('should not change user state after failed logout', async () => {
      const error = new Error('Logout failed');
      mockAuthRepository.logout.rejects(error);
      const initialUser = { isAuthenticated: true, username: 'test', token: 'token' };
      componentVm(wrapper).user = initialUser;

      await componentVm(wrapper).logout();
      await flushPromises();

      expect(componentVm(wrapper).user).toEqual(initialUser);
    });
  });
});
