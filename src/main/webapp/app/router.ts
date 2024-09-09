import { createRouter, createWebHistory } from 'vue-router';
import { homeRoutes } from '@/home/application/HomeRouter';
import { authRoutes } from '@/auth/application/AuthRouter';

const routes = [
  ...homeRoutes(),
  ...authRoutes(),
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
