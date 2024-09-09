import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';
//TODO: use provide(AUTH_SERVICE, authServiceMock) with mound like in jhipster-lite src/test/webapp/unit/module/primary/landscape/LandscapePresetConfigurationComponent.spec.ts
// const wrap = (modulesRepository: ModulesRepositoryStub): VueWrapper => {
//   provide(MODULES_REPOSITORY, modulesRepository);
//   return mount(LandscapePresetConfigurationVue);
// };
import { AUTH_SERVICE } from '@/auth/application/AuthProvider';

vi.mock('@/injections', () => ({
  inject: () => ({
    authenticate: vi.fn().mockResolvedValue({ isAuthenticated: true, username: 'testuser', token: 'token' }),
    logout: vi.fn().mockResolvedValue(true),
  }),
}));

describe('AuthVue', () => {
  it('should render login button when user is not authenticated', () => {
    const wrapper = shallowMount(AuthVue);
    expect(wrapper.find('button').text()).toBe('Login');
  });

  it('should render logout button and username when user is authenticated', async () => {
    const wrapper = shallowMount(AuthVue);
    await wrapper.vm.login();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('p').text()).toBe('Welcome, testuser!');
    expect(wrapper.find('button').text()).toBe('Logout');
  });
});
