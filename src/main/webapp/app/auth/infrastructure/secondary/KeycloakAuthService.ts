//TODO: rename to KeycloakAuthRepository.ts
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
//TODO: must use provider like axios at jhipster-lite src/main/webapp/app/module/application/ModuleProvider.ts
import Keycloak from 'keycloak-js';

export class KeycloakAuthService implements AuthRepository {
  private keycloak: Keycloak;

  constructor() {
    this.keycloak = new Keycloak({
      url: 'https://localhost:9443',
      realm: 'jhipster',
      clientId: 'web_app'
    });
  }

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
