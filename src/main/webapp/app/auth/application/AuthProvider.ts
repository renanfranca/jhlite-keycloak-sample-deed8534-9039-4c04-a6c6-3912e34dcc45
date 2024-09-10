import { key } from 'piqure';
import { provide } from '@/injections';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import { KeycloakAuthRepository } from '@/auth/infrastructure/secondary/KeycloakAuthRepository';
import Keycloak from 'keycloak-js';

export const AUTH_REPOSITORY = key<AuthRepository>('AuthRepository');

export const provideForAuth = (keycloak: Keycloak): void => {
  provide(AUTH_REPOSITORY, new KeycloakAuthRepository(keycloak));
};
