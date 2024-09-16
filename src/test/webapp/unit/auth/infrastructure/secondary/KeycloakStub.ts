import Keycloak from 'keycloak-js';
import sinon from 'sinon';
import type{ SinonStub } from 'sinon';

export interface KeycloakStub extends Keycloak {
  init:  SinonStub;
  login:  SinonStub;
  logout:  SinonStub;
  register:  SinonStub;
  accountManagement:  SinonStub;
  updateToken:  SinonStub;
  clearToken:  SinonStub;
  hasRealmRole:  SinonStub;
  hasResourceRole:  SinonStub;
  loadUserProfile:  SinonStub;
  loadUserInfo:  SinonStub;
  authenticated?: boolean;
  token?: string;
  tokenParsed?: { preferred_username?: string };
}

export const stubKeycloak = (): KeycloakStub => ({
  init:  sinon.stub(),
  login:  sinon.stub(),
  logout:  sinon.stub(),
  register:  sinon.stub(),
  accountManagement:  sinon.stub(),
  updateToken:  sinon.stub(),
  clearToken:  sinon.stub(),
  hasRealmRole:  sinon.stub(),
  hasResourceRole:  sinon.stub(),
  loadUserProfile:  sinon.stub(),
  loadUserInfo:  sinon.stub(),
  authenticated: false,
  token: undefined,
  tokenParsed: undefined,
}) as KeycloakStub;
