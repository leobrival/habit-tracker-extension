import { LocalStorage } from "@raycast/api";
import { ApiError, AuthResponse, AuthTokens, LoginRequest, RegisterRequest, RegisterResponse, User } from "./types";

const API_BASE_URL = "http://localhost:3333/api";
const TOKEN_KEY = "habit-tracker-tokens";
const USER_KEY = "habit-tracker-user";

class AuthService {
  private tokens: AuthTokens | null = null;
  private currentUser: User | null = null;

  async initialize() {
    try {
      const storedTokens = await LocalStorage.getItem<string>(TOKEN_KEY);
      const storedUser = await LocalStorage.getItem<string>(USER_KEY);

      if (storedTokens && storedUser) {
        this.tokens = JSON.parse(storedTokens);
        this.currentUser = JSON.parse(storedUser);

        // Verify token is still valid
        const isValid = await this.verifyToken();
        if (!isValid) {
          await this.logout();
        }
      }
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      await this.logout();
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as any;
        throw new ApiError(errorData.message || "Login failed", response.status);
      }

      const authData = (await response.json()) as AuthResponse;

      await this.setAuthData(authData.tokens, authData.user);

      return authData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error during login", 500);
    }
  }

  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = (await response.json()) as any;
        throw new ApiError(errorData.message || "Registration failed", response.status);
      }

      const registerData = (await response.json()) as RegisterResponse;

      // After successful registration, automatically login
      const loginResponse = await this.login({
        email: userData.email,
        password: userData.password,
      });

      return loginResponse.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error during registration", 500);
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.tokens?.accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.tokens.accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.warn("Failed to logout on server:", error);
    } finally {
      await this.clearAuthData();
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      if (!this.tokens?.refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.tokens.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.tokens.refreshToken }),
      });

      if (!response.ok) {
        return false;
      }

      const authData = (await response.json()) as AuthResponse;
      await this.setAuthData(authData.tokens, authData.user);

      return true;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return false;
    }
  }

  async verifyToken(): Promise<boolean> {
    try {
      if (!this.tokens?.accessToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.tokens.accessToken}`,
        },
      });

      if (response.ok) {
        const userData = (await response.json()) as User;
        this.currentUser = userData;
        await LocalStorage.setItem(USER_KEY, JSON.stringify(userData));
        return true;
      }

      // Try to refresh token if verification failed
      if (response.status === 401 && this.tokens.refreshToken) {
        return await this.refreshToken();
      }

      return false;
    } catch (error) {
      console.error("Failed to verify token:", error);
      return false;
    }
  }

  async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.tokens?.accessToken) {
      throw new ApiError("Not authenticated", 401);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.tokens.accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${this.tokens!.accessToken}`,
          };
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
          });

          if (!retryResponse.ok) {
            const errorData = (await retryResponse.json()) as any;
            throw new ApiError(errorData.message || "API request failed", retryResponse.status);
          }

          return (await retryResponse.json()) as T;
        } else {
          await this.logout();
          throw new ApiError("Authentication expired", 401);
        }
      }

      if (!response.ok) {
        const errorData = (await response.json()) as any;
        throw new ApiError(errorData.message || "API request failed", response.status);
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error", 500);
    }
  }

  private async setAuthData(tokens: AuthTokens, user: User): Promise<void> {
    this.tokens = tokens;
    this.currentUser = user;

    await LocalStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    await LocalStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private async clearAuthData(): Promise<void> {
    this.tokens = null;
    this.currentUser = null;

    await LocalStorage.removeItem(TOKEN_KEY);
    await LocalStorage.removeItem(USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.tokens !== null && this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }
}

// Export singleton instance
export const authService = new AuthService();
