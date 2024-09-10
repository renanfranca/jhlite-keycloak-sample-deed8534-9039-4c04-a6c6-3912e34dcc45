import { describe, it, expect, vi } from 'vitest';
import { KeycloakAuthRepository } from '@/auth/infrastructure/secondary/KeycloakAuthRepository';

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

describe('KeycloakAuthRepository', () => {
  it('should authenticate a user', async () => {
    const authRepository = new KeycloakAuthRepository();
    const user = await authRepository.authenticate();
    expect(user.isAuthenticated).toBe(true);
    expect(user.username).toBe('mockuser');
    expect(user.token).toBe('mock-token');
  });

  it('should logout a user', async () => {
    const authRepository = new KeycloakAuthRepository();
    const result = await authRepository.logout();
    expect(result).toBe(true);
  });

  it('should check if a user is authenticated', async () => {
    const authRepository = new KeycloakAuthRepository();
    const isAuthenticated = await authRepository.isAuthenticated();
    expect(isAuthenticated).toBe(true);
  });

  it('should refresh the token', async () => {
    const authRepository = new KeycloakAuthRepository();
    const newToken = await authRepository.refreshToken();
    expect(newToken).toBe('mock-token');
  });
});
