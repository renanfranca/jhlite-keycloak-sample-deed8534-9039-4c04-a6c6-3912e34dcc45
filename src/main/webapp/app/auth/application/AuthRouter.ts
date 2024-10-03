import type { RouteRecordRaw } from 'vue-router';
import AuthVue from '@/auth/infrastructure/primary/AuthVue.vue';

export const authRoutes = (): RouteRecordRaw[] => [
  {
    path: '/login',
    name: 'Login',
    component: AuthVue,
  },
];
