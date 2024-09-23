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

    onMounted(() => {
      init();
    });

    const init = () => {
      isLoading.value = true;
      return authRepository.authenticated()
        .then((authenticated) => {
          if (authenticated) {
            return authRepository.currentUser();
          } else {
            return null;
          }
        })
        .then((currentUser) => {
          user.value = currentUser;
        })
        .catch((error) => {
          console.error('Initialization failed:', error);
          user.value = null;
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    const login = () => {
      isLoading.value = true;
      authRepository.login()
        .then(() => authRepository.currentUser())
        .then((currentUser) => {
          user.value = currentUser.isAuthenticated ? currentUser : null;
        })
        .catch((error) => {
          console.error('Login failed:', error);
          user.value = null;
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    const logout = () => {
      isLoading.value = true;
      authRepository.logout()
        .then(() => {
          user.value = null;
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    return {
      user,
      isLoading,
      login,
      logout,
    };
  },
});
