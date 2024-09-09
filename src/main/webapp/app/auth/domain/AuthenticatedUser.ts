export interface AuthenticatedUser {
  isAuthenticated: boolean;
  username: string;
  token: string;
}
