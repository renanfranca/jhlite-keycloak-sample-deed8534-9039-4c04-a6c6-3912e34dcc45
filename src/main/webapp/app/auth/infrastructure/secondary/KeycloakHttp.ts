import Keycloak from 'keycloak-js';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';

export class KeycloakHttp {
  constructor(private readonly keycloak: Keycloak) {}

  async init(): Promise<boolean> {
    return this.keycloak.init({ onLoad: 'login-required', checkLoginIframe: false });
  }

  async authenticate(): Promise<AuthenticatedUser> {
    try {
      const authenticated = await this.init();
      if (authenticated) {
        return {
          isAuthenticated: true,
          username: this.keycloak.tokenParsed?.preferred_username || '',
          token: this.keycloak.token || '',
        };
      }
    } catch (error) {
      console.error('Authentication failed', error);
    }
    return { isAuthenticated: false, username: '', token: '' };
  }

  async logout(): Promise<void> {
    return this.keycloak.logout();
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.authenticated || false;
    } catch (error) {
      return false;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      await this.keycloak.updateToken(30);
      return this.keycloak.token || '';
    } catch (error) {
      console.error('Token refresh failed', error);
      return '';
    }
  }

  getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }
}
