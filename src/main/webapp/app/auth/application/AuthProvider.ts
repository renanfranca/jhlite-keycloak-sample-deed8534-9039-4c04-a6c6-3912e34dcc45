import { key } from 'piqure';
import { provide } from '@/injections';
import type { AuthService } from '@/auth/domain/AuthService';
import { KeycloakAuthService } from '@/auth/infrastructure/secondary/KeycloakAuthService';

//TODO: rename to export const AUTH_REPOSITORY = key<AuthRepository>('AuthRepository');
export const AUTH_SERVICE = key<AuthService>('AuthService');

export const provideForAuth = (): void => {
  provide(AUTH_SERVICE, new KeycloakAuthService());
};
