import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import { KeycloakHttp } from './KeycloakHttp';

export class KeycloakAuthRepository implements AuthRepository {
  constructor(private readonly keycloakHttp: KeycloakHttp) {}

  async currentUser(): Promise<AuthenticatedUser> {
    try {
      return await this.keycloakHttp.currentUser();
    } catch (error) {
      console.error('Authentication failed', error);
      return { isAuthenticated: false, username: '', token: '' };
    }
  }

  async login(): Promise<void> {
    try {
      await this.keycloakHttp.login();
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
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

  async authenticated(): Promise<boolean> {
    try {
      return await this.keycloakHttp.authenticated();
    } catch (error) {
      console.error('isAuthenticated check failed', error);
      return false;
    }
  }

  async refreshToken(): Promise<string> {
    try {
      return await this.keycloakHttp.refreshToken();
    } catch (error) {
      console.error('Token refresh failed', error);
      return '';
    }
  }
}
