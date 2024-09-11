import { describe, it, expect, beforeEach } from 'vitest';
import { KeycloakHttp } from '@/auth/infrastructure/secondary/KeycloakHttp';
import { createKeycloakStub } from './KeycloakStub';
import { fakeAuthenticatedUser } from './KeycloakHttpStub';

const fakeKeycloakConfig = {
  url: 'http://localhost:8080/auth',
  realm: 'myrealm',
  clientId: 'myclient',
};

describe('KeycloakHttp', () => {
  let keycloakStub: ReturnType<typeof createKeycloakStub>;
  let keycloakHttp: KeycloakHttp;

  beforeEach(() => {
    keycloakStub = createKeycloakStub();
    keycloakHttp = new KeycloakHttp(fakeKeycloakConfig);
    Object.assign(keycloakHttp, { keycloak: keycloakStub });
  });

  describe('init', () => {
    it('should initialize Keycloak', async () => {
      keycloakStub.init.resolves(true);

      const result = await keycloakHttp.init();

      expect(result).toBe(true);
      expect(keycloakStub.init.calledOnce).toBe(true);
    });
  });

  describe('authenticate', () => {
    it('should authenticate successfully', async () => {
      const fakeUser = fakeAuthenticatedUser();
      keycloakStub.init.resolves(true);
      keycloakStub.tokenParsed = { preferred_username: fakeUser.username };
      keycloakStub.token = fakeUser.token;

      const result = await keycloakHttp.authenticate();

      expect(result).toEqual(fakeUser);
      expect(keycloakStub.init.calledOnce).toBe(true);
    });

    it('should handle authentication failure', async () => {
      keycloakStub.init.resolves(false);

      const result = await keycloakHttp.authenticate();

      expect(result).toEqual({ isAuthenticated: false, username: '', token: '' });
      expect(keycloakStub.init.calledOnce).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout', async () => {
      keycloakStub.logout.resolves();

      await keycloakHttp.logout();

      expect(keycloakStub.logout.calledOnce).toBe(true);
    });
  });

  describe('isAuthenticated', () => {
    it('should check if authenticated', async () => {
      keycloakStub.updateToken.resolves();
      keycloakStub.authenticated = true;

      const result = await keycloakHttp.isAuthenticated();

      expect(result).toBe(true);
      expect(keycloakStub.updateToken.calledOnce).toBe(true);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token', async () => {
      const newToken = 'new-test-token';
      keycloakStub.updateToken.resolves();
      keycloakStub.token = newToken;

      const result = await keycloakHttp.refreshToken();

      expect(result).toBe(newToken);
      expect(keycloakStub.updateToken.calledOnce).toBe(true);
    });
  });

  describe('getKeycloakInstance', () => {
    it('should get Keycloak instance', () => {
      const result = keycloakHttp.getKeycloakInstance();

      expect(result).toBe(keycloakStub);
    });
  });
});
