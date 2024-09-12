import { key } from 'piqure';
import { provide} from '@/injections';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import { KeycloakAuthRepository } from '@/auth/infrastructure/secondary/KeycloakAuthRepository';
import { KeycloakHttp } from '@/auth/infrastructure/secondary/KeycloakHttp';

export const AUTH_REPOSITORY = key<AuthRepository>('AuthRepository');

export const provideForAuth = (keycloakHttp: KeycloakHttp): void => {
  provide(AUTH_REPOSITORY, new KeycloakAuthRepository(keycloakHttp));
};
