import { defineComponent, onMounted, ref } from 'vue';
import { inject } from '@/injections';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import type { AuthenticatedUser } from "@/auth/domain/AuthenticatedUser";

export default defineComponent({
  name: 'AuthVue',
  setup() {
    const authRepository = inject(AUTH_REPOSITORY);
    const user = ref<AuthenticatedUser | null>(null);
    const isLoading = ref(true);

    onMounted(async () => {
      await init();
    });

    const init = async () => {
      isLoading.value = true;
      try {
        const authenticated = await authRepository.authenticated();
        if (authenticated) {
          user.value = await authRepository.currentUser();
        } else {
          user.value = null;
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        user.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const login = async () => {
      isLoading.value = true;
      try {
        await authRepository.login();
      } catch (error) {
        console.error('Login failed:', error);
        user.value = null;
      } finally {
        isLoading.value = false;
      }
    };

    const logout = async () => {
      isLoading.value = true;
      try {
        await authRepository.logout();
        user.value = null;
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        isLoading.value = false;
      }
    };

    return {
      user,
      isLoading,
      login,
      logout,
    };
  },
});
