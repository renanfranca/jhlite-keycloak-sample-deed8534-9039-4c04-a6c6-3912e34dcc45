import { describe, it, expect } from 'vitest';
import { flushPromises, mount} from '@vue/test-utils';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import { provide } from '@/injections';
import sinon from 'sinon';
import type { SinonStub } from 'sinon';
import type {AuthRepository} from "@/auth/domain/AuthRepository";

interface MockAuthRepository extends AuthRepository {
  currentUser: SinonStub;
  login: SinonStub;
  logout: SinonStub;
  authenticated: SinonStub;
  refreshToken: SinonStub;
}

const mockAuthRepository: MockAuthRepository  = {
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

describe('AuthVue', () => {
  it('should render login button when user is not authenticated', async () => {
    mockAuthRepository.authenticated.resolves(false);
    mockAuthRepository.currentUser.resolves({ isAuthenticated: false, username: '', token: '' });
    const wrapper = wrap();
    await flushPromises();
    expect(wrapper.find('button').text()).toBe('Login');
  });

  it('should render logout button and username when user is authenticated', async () => {
    mockAuthRepository.authenticated.resolves(true);
    mockAuthRepository.currentUser.resolves({ isAuthenticated: true, username: 'testuser', token: 'token' });
    const wrapper = wrap();
    await flushPromises();
    expect(wrapper.find('p').text()).toBe('Welcome, testuser!');
    expect(wrapper.find('button').text()).toBe('Logout');
  });
});
