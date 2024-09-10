import { describe, it, expect, beforeEach } from 'vitest';
import { KeycloakAuthRepository } from '@/auth/infrastructure/secondary/KeycloakAuthRepository';
import type { KeycloakHttpStub } from './KeycloakHttpStub';
import { stubKeycloakHttp, fakeAuthenticatedUser } from './KeycloakHttpStub';

describe('KeycloakAuthRepository', () => {
  let keycloakHttpStub: KeycloakHttpStub;
  let authRepository: KeycloakAuthRepository;

  beforeEach(() => {
    keycloakHttpStub = stubKeycloakHttp();
    authRepository = new KeycloakAuthRepository(keycloakHttpStub);
  });

  it('should authenticate a user', async () => {
    const mockUser = fakeAuthenticatedUser();
    keycloakHttpStub.authenticate.resolves(mockUser);

    const user = await authRepository.authenticate();

    expect(user).toEqual(mockUser);
    expect(keycloakHttpStub.authenticate.calledOnce).toBe(true);
  });

  it('should logout a user', async () => {
    keycloakHttpStub.logout.resolves();

    const result = await authRepository.logout();

    expect(result).toBe(true);
    expect(keycloakHttpStub.logout.calledOnce).toBe(true);
  });

  it('should check if a user is authenticated', async () => {
    keycloakHttpStub.isAuthenticated.resolves(true);

    const isAuthenticated = await authRepository.isAuthenticated();

    expect(isAuthenticated).toBe(true);
    expect(keycloakHttpStub.isAuthenticated.calledOnce).toBe(true);
  });

  it('should refresh the token', async () => {
    const newToken = 'new-test-token';
    keycloakHttpStub.refreshToken.resolves(newToken);

    const refreshedToken = await authRepository.refreshToken();

    expect(refreshedToken).toBe(newToken);
    expect(keycloakHttpStub.refreshToken.calledOnce).toBe(true);
  });
});
