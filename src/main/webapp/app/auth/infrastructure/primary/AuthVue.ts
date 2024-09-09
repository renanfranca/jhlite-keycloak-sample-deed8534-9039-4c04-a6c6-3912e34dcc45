import { defineComponent, ref } from 'vue';
import { inject } from '@/injections';
import { AUTH_SERVICE } from '@/auth/application/AuthProvider';
import  type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';

export default defineComponent({
  name: 'AuthVue',
  setup() {
    //TODO: rename to auths
    const authService = inject(AUTH_SERVICE);
    const user = ref<AuthenticatedUser | null>(null);

    const login = async () => {
      user.value = await authService.authenticate();
    };

    const logout = async () => {
      await authService.logout();
      user.value = null;
    };

    return {
      user,
      login,
      logout,
    };
  },
});
