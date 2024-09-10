import type {AuthenticatedUser} from "@/auth/domain/AuthenticatedUser";

export interface AuthRepository {
  authenticate(): Promise<AuthenticatedUser>;
  logout(): Promise<boolean>;
  isAuthenticated(): Promise<boolean>;
  refreshToken(): Promise<string>;
}
