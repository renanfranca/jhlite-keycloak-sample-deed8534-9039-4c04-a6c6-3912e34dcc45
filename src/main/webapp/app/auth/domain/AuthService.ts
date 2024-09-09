//TODO: rename to AuthRepository.ts
import type {AuthenticatedUser} from "@/auth/domain/AuthenticatedUser";

export interface AuthService {
  authenticate(): Promise<AuthenticatedUser>;
  logout(): Promise<boolean>;
  isAuthenticated(): Promise<boolean>;
  refreshToken(): Promise<string>;
}
