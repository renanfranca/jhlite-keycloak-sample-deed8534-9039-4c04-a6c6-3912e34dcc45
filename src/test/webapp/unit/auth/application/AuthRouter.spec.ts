import { describe, it, expect } from 'vitest';
import { authRoutes } from '@/auth/application/AuthRouter';

describe('AuthRouter', () => {
  it('should define routes', () => {
    const routes = authRoutes();
    expect(routes).toHaveLength(1);
    expect(routes[0].path).toBe('/login');
    expect(routes[0].name).toBe('Login');
  });
});
