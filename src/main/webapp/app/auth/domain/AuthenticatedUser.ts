type AuthenticatedUserName = string;
type AuthenticatedUserToken = string;

export interface AuthenticatedUser {
  isAuthenticated: boolean;
  username: AuthenticatedUserName;
  token: AuthenticatedUserToken;
}
