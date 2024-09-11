import type Keycloak from 'keycloak-js';
import sinon from 'sinon';

export class KeycloakStub implements Partial<Keycloak> {
  init = sinon.stub();
  login = sinon.stub();
  logout = sinon.stub();
  register = sinon.stub();
  accountManagement = sinon.stub();
  updateToken = sinon.stub();
  clearToken = sinon.stub();
  hasRealmRole = sinon.stub();
  hasResourceRole = sinon.stub();
  loadUserProfile = sinon.stub();
  loadUserInfo = sinon.stub();

  authenticated?: boolean;
  token?: string;
  tokenParsed?: { preferred_username?: string };

  constructor() {
    this.authenticated = false;
    this.token = undefined;
    this.tokenParsed = undefined;
  }
}

export const createKeycloakStub = (): KeycloakStub => {
  return new KeycloakStub();
};
