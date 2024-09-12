import { describe, it, expect } from 'vitest';
import { KeycloakHttp } from '@/auth/infrastructure/secondary/KeycloakHttp';
import { stubKeycloak } from './KeycloakStub';
import { fakeAuthenticatedUser } from './KeycloakHttpStub';

const createKeycloakHttp = () => {
  const keycloakStub = stubKeycloak();
  const keycloakHttp = new KeycloakHttp(keycloakStub);
  return { keycloakStub, keycloakHttp };
};

describe('KeycloakHttp', () => {
  describe('Authentication', () => {
    it('should authenticate successfully', async () => {
      const { keycloakStub, keycloakHttp } = createKeycloakHttp();
      const fakeUser = fakeAuthenticatedUser();
      keycloakStub.init.resolves(true);
      keycloakStub.authenticated = true;
      keycloakStub.tokenParsed = { preferred_username: fakeUser.username };
      keycloakStub.token = fakeUser.token;

      const result = await keycloakHttp.currentUser();

      expect(result).toEqual(fakeUser);
      expect(keycloakStub.init.calledOnce).toBe(true);
    });

    it('should handle authentication failure', async () => {
      const { keycloakStub, keycloakHttp } = createKeycloakHttp();
      keycloakStub.init.resolves(false);

      const result = await keycloakHttp.currentUser();

      expect(result).toEqual({ isAuthenticated: false, username: '', token: '' });
      expect(keycloakStub.init.calledOnce).toBe(true);
    });
  });

  it('should logout', async () => {
    const { keycloakStub, keycloakHttp } = createKeycloakHttp();
    keycloakStub.logout.resolves();

    await keycloakHttp.logout();

    expect(keycloakStub.logout.calledOnce).toBe(true);
  });

  it('should check if authenticated', async () => {
    const { keycloakStub, keycloakHttp } = createKeycloakHttp();
    keycloakStub.init.resolves(true);
    keycloakStub.authenticated = true;
    keycloakStub.token = 'valid-token';

    const result = await keycloakHttp.authenticated();

    expect(result).toBe(true);
    expect(keycloakStub.init.calledOnce).toBe(true);
  });

  it('should refresh token', async () => {
    const { keycloakStub, keycloakHttp } = createKeycloakHttp();
    const newToken = 'new-test-token';
    keycloakStub.updateToken.resolves();
    keycloakStub.token = newToken;

    const result = await keycloakHttp.refreshToken();

    expect(result).toBe(newToken);
    expect(keycloakStub.updateToken.calledOnce).toBe(true);
  });
});
