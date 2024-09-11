import sinon from 'sinon';
import type { SinonStub } from 'sinon';
import type { KeycloakHttp } from '@/auth/infrastructure/secondary/KeycloakHttp';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';

export interface KeycloakHttpStub extends KeycloakHttp {
  authenticate: SinonStub;
  logout: SinonStub;
  isAuthenticated: SinonStub;
  refreshToken: SinonStub;
  getKeycloakInstance: SinonStub;
}

export const stubKeycloakHttp = (): KeycloakHttpStub => ({
  authenticate: sinon.stub(),
  logout: sinon.stub(),
  isAuthenticated: sinon.stub(),
  refreshToken: sinon.stub(),
  getKeycloakInstance: sinon.stub(),
}) as KeycloakHttpStub;

export const fakeAuthenticatedUser = (): AuthenticatedUser => ({
  isAuthenticated: true,
  username: 'testuser',
  token: 'test-token'
});
