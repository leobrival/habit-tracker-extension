import { LocalStorage } from "@raycast/api";
import { ApiError, AuthResponse, LoginRequest, RegisterRequest, RegisterResponse, SupabaseSession, User } from "./types";

const API_BASE_URL = "http://localhost:3333/api";
const SESSION_KEY = "habit-tracker-session";
const USER_KEY = "habit-tracker-user";

class AuthService {
  private session: SupabaseSession | null = null;
  private currentUser: User | null = null;

  async initialize() {
    try {
      const storedSession = await LocalStorage.getItem<string>(SESSION_KEY);
      const storedUser = await LocalStorage.getItem<string>(USER_KEY);

      if (storedSession && storedUser) {
        this.session = JSON.parse(storedSession);
        this.currentUser = JSON.parse(storedUser);

        // Verify session is still valid
        const isValid = await this.verifySession();
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
        credentials: 'include', // Important: Include cookies for session management
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new ApiError(errorData.message || "Login failed", response.status);
      }

      const authData = await response.json() as AuthResponse;

      await this.setAuthData(authData.session, authData.user);

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
        credentials: 'include', // Important: Include cookies for session management
      });

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new ApiError(errorData.message || "Registration failed", response.status);
      }

      const registerData = await response.json() as RegisterResponse;

      // Store session and user data
      await this.setAuthData(registerData.session, registerData.user);

      return registerData.user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error during registration", 500);
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.session) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include', // Important: Include cookies
        });
      }
    } catch (error) {
      console.warn("Failed to logout on server:", error);
    } finally {
      await this.clearAuthData();
    }
  }

  async verifySession(): Promise<boolean> {
    try {
      if (!this.session) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        credentials: 'include', // Important: Include cookies
      });

      if (response.ok) {
        const data = await response.json() as { user: User };
        this.currentUser = data.user;
        await LocalStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Failed to verify session:", error);
      return false;
    }
  }

  async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.session) {
      throw new ApiError("Not authenticated", 401);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Important: Include cookies for session
      });

      if (response.status === 401) {
        // Session expired, logout
        await this.logout();
        throw new ApiError("Authentication expired", 401);
      }

      if (!response.ok) {
        const errorData = await response.json() as any;
        throw new ApiError(errorData.message || "API request failed", response.status);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Network error", 500);
    }
  }

  private async setAuthData(session: SupabaseSession, user: User): Promise<void> {
    this.session = session;
    this.currentUser = user;

    await LocalStorage.setItem(SESSION_KEY, JSON.stringify(session));
    await LocalStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private async clearAuthData(): Promise<void> {
    this.session = null;
    this.currentUser = null;

    await LocalStorage.removeItem(SESSION_KEY);
    await LocalStorage.removeItem(USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.session !== null && this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getSession(): SupabaseSession | null {
    return this.session;
  }
}

// Export singleton instance
export const authService = new AuthService();
