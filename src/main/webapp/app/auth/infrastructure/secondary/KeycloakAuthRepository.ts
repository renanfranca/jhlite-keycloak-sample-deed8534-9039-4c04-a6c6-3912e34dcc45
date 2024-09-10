import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import { KeycloakHttp } from './KeycloakHttp';

export class KeycloakAuthRepository implements AuthRepository {
  constructor(private keycloakHttp: KeycloakHttp) {}

  async authenticate(): Promise<AuthenticatedUser> {
    return this.keycloakHttp.authenticate();
  }

  async logout(): Promise<boolean> {
    try {
      await this.keycloakHttp.logout();
      return true;
    } catch (error) {
      console.error('Logout failed', error);
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return this.keycloakHttp.isAuthenticated();
  }

  async refreshToken(): Promise<string> {
    return this.keycloakHttp.refreshToken();
  }
}
