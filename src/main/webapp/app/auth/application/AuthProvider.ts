import { key } from 'piqure';
import { provide } from '@/injections';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import { KeycloakAuthService } from '@/auth/infrastructure/secondary/KeycloakAuthService';

export const AUTH_REPOSITORY = key<AuthRepository>('AuthRepository');

export const provideForAuth = (): void => {
  provide(AUTH_REPOSITORY, new KeycloakAuthService());
};
