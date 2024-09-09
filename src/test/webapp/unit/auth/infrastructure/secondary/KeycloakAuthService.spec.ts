//TODO: rename to KeycloakAuthRepository.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { KeycloakAuthService } from '@/auth/infrastructure/secondary/KeycloakAuthService';

vi.mock('keycloak-js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      init: vi.fn().mockResolvedValue(true),
      logout: vi.fn().mockResolvedValue(undefined),
      updateToken: vi.fn().mockResolvedValue(true),
      token: 'mock-token',
      tokenParsed: { preferred_username: 'mockuser' },
      authenticated: true,
    }))
  }
});

describe('KeycloakAuthService', () => {
  it('should authenticate a user', async () => {
    const authService = new KeycloakAuthService();
    const user = await authService.authenticate();
    expect(user.isAuthenticated).toBe(true);
    expect(user.username).toBe('mockuser');
    expect(user.token).toBe('mock-token');
  });

  it('should logout a user', async () => {
    const authService = new KeycloakAuthService();
    const result = await authService.logout();
    expect(result).toBe(true);
  });

  it('should check if a user is authenticated', async () => {
    const authService = new KeycloakAuthService();
    const isAuthenticated = await authService.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  it('should refresh the token', async () => {
    const authService = new KeycloakAuthService();
    const newToken = await authService.refreshToken();
    expect(newToken).toBe('mock-token');
  });
});
