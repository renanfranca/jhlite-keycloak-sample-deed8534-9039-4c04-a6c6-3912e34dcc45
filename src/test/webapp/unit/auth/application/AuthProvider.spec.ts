import { describe, it, expect, beforeEach } from 'vitest';
import { AUTH_REPOSITORY, provideForAuth } from '@/auth/application/AuthProvider';
import { KeycloakAuthRepository } from '@/auth/infrastructure/secondary/KeycloakAuthRepository';
import { inject } from '@/injections';
import { type KeycloakStub, stubKeycloak } from '../infrastructure/secondary/KeycloakStub';
import { type KeycloakHttpStub, stubKeycloakHttp } from '../infrastructure/secondary/KeycloakHttpStub';

describe('AuthProvider', () => {
  let keycloakStub: KeycloakStub;
  let keycloakHttp: KeycloakHttpStub;

  beforeEach(() => {
    keycloakStub = stubKeycloak();
    keycloakHttp = stubKeycloakHttp();
  });

  it('should define AUTH_REPOSITORY with the correct key', () => {
    expect(AUTH_REPOSITORY.description).toBe('AuthRepository');
  });

  it('should provide KeycloakAuthRepository with KeycloakHttp', async () => {
    provideForAuth(keycloakHttp);

    const injectedRepository = inject(AUTH_REPOSITORY);
    expect(injectedRepository).toBeInstanceOf(KeycloakAuthRepository);
  });
});
