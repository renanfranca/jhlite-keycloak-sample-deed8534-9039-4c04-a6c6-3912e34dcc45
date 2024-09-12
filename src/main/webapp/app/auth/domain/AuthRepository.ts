import type {AuthenticatedUser} from "@/auth/domain/AuthenticatedUser";

export interface AuthRepository {
  currentUser(): Promise<AuthenticatedUser>;
  login(): Promise<void>;
  logout(): Promise<boolean>;
  authenticated(): Promise<boolean>;
  refreshToken(): Promise<string>;
}
