//TODO: rename to AuthVue.component.ts
import { defineComponent, ref } from 'vue';
import { inject } from '@/injections';
import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import  type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';

export default defineComponent({
  name: 'AuthVue',
  setup() {
    const auths = inject(AUTH_REPOSITORY);
    const user = ref<AuthenticatedUser | null>(null);

    const login = async () => {
      user.value = await auths.authenticate();
    };

    const logout = async () => {
      await auths.logout();
      user.value = null;
    };

    return {
      user,
      login,
      logout,
    };
  },
});
