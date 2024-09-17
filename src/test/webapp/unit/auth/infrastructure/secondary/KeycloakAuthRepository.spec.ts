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
    keycloakHttpStub.currentUser.resolves(mockUser);

    const user = await authRepository.currentUser();

    expect(user).toEqual(mockUser);
    expect(keycloakHttpStub.currentUser.calledOnce).toBe(true);
  });

  it('should return unauthenticated user when currentUser throws an error', async () => {
    keycloakHttpStub.currentUser.rejects(new Error('Authentication failed'));

    const user = await authRepository.currentUser();

    expect(user).toEqual({ isAuthenticated: false, username: '', token: '' });
    expect(keycloakHttpStub.currentUser.calledOnce).toBe(true);
  });

  it('should login a user successfully', async () => {
    keycloakHttpStub.login.resolves();

    await authRepository.login();

    expect(keycloakHttpStub.login.calledOnce).toBe(true);
  });

  it('should throw an error when login fails', async () => {
    const error = new Error('Login failed');
    keycloakHttpStub.login.rejects(error);

    await expect(authRepository.login()).rejects.toThrow('Login failed');
    expect(keycloakHttpStub.login.calledOnce).toBe(true);
  });

  it('should logout a user', async () => {
    keycloakHttpStub.logout.resolves();

    const result = await authRepository.logout();

    expect(result).toBe(true);
    expect(keycloakHttpStub.logout.calledOnce).toBe(true);
  });

  it('should return false when logout throws an error', async () => {
    keycloakHttpStub.logout.rejects(new Error('Logout failed'));

    const result = await authRepository.logout();

    expect(result).toBe(false);
    expect(keycloakHttpStub.logout.calledOnce).toBe(true);
  });

  it('should check if a user is authenticated', async () => {
    keycloakHttpStub.authenticated.resolves(true);

    const isAuthenticated = await authRepository.authenticated();

    expect(isAuthenticated).toBe(true);
    expect(keycloakHttpStub.authenticated.calledOnce).toBe(true);
  });

  it('should return false when authenticated check throws an error', async () => {
    keycloakHttpStub.authenticated.rejects(new Error('Authentication check failed'));

    const isAuthenticated = await authRepository.authenticated();

    expect(isAuthenticated).toBe(false);
    expect(keycloakHttpStub.authenticated.calledOnce).toBe(true);
  });

  it('should refresh the token', async () => {
    const newToken = 'new-test-token';
    keycloakHttpStub.refreshToken.resolves(newToken);

    const refreshedToken = await authRepository.refreshToken();

    expect(refreshedToken).toBe(newToken);
    expect(keycloakHttpStub.refreshToken.calledOnce).toBe(true);
  });

  it('should return an empty string when refreshToken throws an error', async () => {
    keycloakHttpStub.refreshToken.rejects(new Error('Token refresh failed'));

    const refreshedToken = await authRepository.refreshToken();

    expect(refreshedToken).toBe('');
    expect(keycloakHttpStub.refreshToken.calledOnce).toBe(true);
  });
});
