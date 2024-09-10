import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import Keycloak from 'keycloak-js';

export class KeycloakAuthRepository implements AuthRepository {
  constructor(private keycloak: Keycloak) {}

  async authenticate(): Promise<AuthenticatedUser> {
    try {
      const authenticated = await this.keycloak.init({ onLoad: 'login-required',
        checkLoginIframe: false });
      if (authenticated) {
        return {
          isAuthenticated: true,
          username: this.keycloak.tokenParsed?.preferred_username || '',
          token: this.keycloak.token || ''
        };
      }
    } catch (error) {
      console.error('Authentication failed', error);
    }
    return { isAuthenticated: false, username: '', token: '' };
  }

  async logout(): Promise<boolean> {
    try {
      await this.keycloak.logout();
      return true;
    } catch (error) {
      console.error('Logout failed', error);
      return false;
    }
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
}
