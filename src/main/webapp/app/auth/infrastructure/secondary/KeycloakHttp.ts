import Keycloak from 'keycloak-js';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';

export class KeycloakHttp {
  private initialized: boolean = false;

  constructor(private readonly keycloak: Keycloak) {}

  private async init(): Promise<boolean> {
    if (!this.initialized) {
      await this.keycloak.init({ onLoad: 'check-sso', checkLoginIframe: false });
      this.initialized = true;
    }
    return this.initialized;
  }

  async currentUser(): Promise<AuthenticatedUser> {
    await this.init();
    if (this.keycloak.authenticated) {
      return {
        isAuthenticated: true,
        username: this.keycloak.tokenParsed?.preferred_username || '',
        token: this.keycloak.token || '',
      };
    } else {
      return { isAuthenticated: false, username: '', token: '' };
    }
  }

  async login(): Promise<void> {
    await this.init();
    return this.keycloak.login();
  }

  async logout(): Promise<void> {
    await this.init();
    return this.keycloak.logout();
  }

  async authenticated(): Promise<boolean> {
    await this.init();
    return !!this.keycloak.token;
  }

  async refreshToken(): Promise<string> {
    await this.init();
    await this.keycloak.updateToken(5);
    return this.keycloak.token || '';
  }
}
