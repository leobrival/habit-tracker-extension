import { getPreferenceValues, LocalStorage } from "@raycast/api";
import { useLocalStorage } from "@raycast/utils";
import {
  ApiError,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  SupabaseSession,
  User,
} from "./types";

interface Preferences {
  apiBaseUrl: string;
}

const SESSION_KEY = "habit-tracker-session";
const USER_KEY = "habit-tracker-user";

interface SessionWithExpiry extends SupabaseSession {
  expiresAt?: number; // Timestamp when session expires
}

class AuthService {
  private session: SessionWithExpiry | null = null;
  private currentUser: User | null = null;
  private apiBaseUrl: string;

  constructor() {
    const preferences = getPreferenceValues<Preferences>();
    this.apiBaseUrl = preferences.apiBaseUrl;
  }

  async initialize() {
    try {
      const storedSession = await LocalStorage.getItem<string>(SESSION_KEY);
      const storedUser = await LocalStorage.getItem<string>(USER_KEY);

      if (storedSession && storedUser) {
        this.session = JSON.parse(storedSession);
        this.currentUser = JSON.parse(storedUser);

        // Check if session is expired before verification
        if (this.isSessionExpired()) {
          console.log("AuthService: Session expired, clearing data");
          await this.logout();
          return;
        }

        // Verify session is still valid
        const isValid = await this.verifySession();
        if (!isValid) {
          await this.logout();
        }
      }
    } catch (error) {
      console.error("AuthService: Failed to initialize:", error);
      await this.logout();
    }
  }

  private isSessionExpired(): boolean {
    if (!this.session?.expiresAt) {
      return false; // If no expiry, assume valid
    }
    return Date.now() >= this.session.expiresAt;
  }

  private async refreshSession(): Promise<boolean> {
    if (!this.session?.refresh_token) {
      return false;
    }

    try {
      console.log("AuthService: Refreshing session...");
      const response = await fetch(`${this.apiBaseUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: this.session.refresh_token,
        }),
        credentials: "include",
      });

      if (response.ok) {
        const authData = (await response.json()) as AuthResponse;
        await this.setAuthData(authData.session, this.currentUser!);
        console.log("AuthService: Session refreshed successfully");
        return true;
      }

      console.log("AuthService: Failed to refresh session");
      return false;
    } catch (error) {
      console.error("AuthService: Error refreshing session:", error);
      return false;
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeApiRequest(`/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new ApiError(errorData.message || "Login failed", response.status);
      }

      const authData = (await response.json()) as AuthResponse;
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
      const response = await this.makeApiRequest(`/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = (await response.json()) as { message?: string };
        throw new ApiError(errorData.message || "Registration failed", response.status);
      }

      const registerData = (await response.json()) as RegisterResponse;
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
        await this.makeApiRequest(`/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      }
    } catch (error) {
      console.warn("AuthService: Failed to logout on server:", error);
    } finally {
      await this.clearAuthData();
    }
  }

  async verifySession(): Promise<boolean> {
    try {
      console.log("AuthService: Verifying session...");

      // Check if session is expired before API call
      if (this.isSessionExpired()) {
        console.log("AuthService: Session expired, attempting refresh...");
        const refreshed = await this.refreshSession();
        if (!refreshed) {
          return false;
        }
      }

      const response = await this.makeApiRequest(`/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      console.log("AuthService: Response status:", response.status);

      if (response.ok) {
        const data = (await response.json()) as { user: User };
        console.log("AuthService: User verified");
        this.currentUser = data.user;

        // Create session if not exists (for cookie-based auth)
        if (!this.session) {
          this.session = {
            access_token: "cookie-based-session",
            refresh_token: "cookie-based-session",
          };
        }

        await LocalStorage.setItem(USER_KEY, JSON.stringify(data.user));
        await LocalStorage.setItem(SESSION_KEY, JSON.stringify(this.session));
        return true;
      }

      return false;
    } catch (error) {
      console.error("AuthService: Failed to verify session:", error);
      return false;
    }
  }

  async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.session) {
      throw new ApiError("Not authenticated", 401);
    }

    // Check if session is expired and refresh if needed
    if (this.isSessionExpired()) {
      const refreshed = await this.refreshSession();
      if (!refreshed) {
        await this.logout();
        throw new ApiError("Session expired", 401);
      }
    }

    const url = `${this.apiBaseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    let retryCount = 0;
    const maxRetries = 1;

    while (retryCount <= maxRetries) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });

        if (response.status === 401 && retryCount < maxRetries) {
          console.log("AuthService: 401 error, attempting to refresh session...");
          const refreshed = await this.refreshSession();
          if (refreshed) {
            retryCount++;
            continue; // Retry the request
          } else {
            // Refresh failed, logout
            await this.logout();
            throw new ApiError("Authentication expired", 401);
          }
        }

        if (!response.ok) {
          const errorData = (await response.json()) as { message?: string };
          throw new ApiError(errorData.message || "API request failed", response.status);
        }

        return (await response.json()) as T;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        if (retryCount < maxRetries) {
          retryCount++;
          continue;
        }
        throw new ApiError("Network error", 500);
      }
    }

    throw new ApiError("Max retries exceeded", 500);
  }

  private async makeApiRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const url = `${this.apiBaseUrl}${endpoint}`;
    return fetch(url, options);
  }

  private async setAuthData(session: SupabaseSession, user: User): Promise<void> {
    // Calculate expiration time (subtract 30s for safety)
    const expiresIn = 3600; // Default 1 hour if not provided
    const expiresAt = Date.now() + (expiresIn - 30) * 1000;

    const sessionWithExpiry: SessionWithExpiry = {
      ...session,
      expiresAt,
    };

    this.session = sessionWithExpiry;
    this.currentUser = user;

    await LocalStorage.setItem(SESSION_KEY, JSON.stringify(sessionWithExpiry));
    await LocalStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private async clearAuthData(): Promise<void> {
    this.session = null;
    this.currentUser = null;

    await LocalStorage.removeItem(SESSION_KEY);
    await LocalStorage.removeItem(USER_KEY);
  }

  isAuthenticated(): boolean {
    return this.session !== null && this.currentUser !== null && !this.isSessionExpired();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getSession(): SessionWithExpiry | null {
    return this.session;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Hook for reactive session state
export function useAuthSession() {
  const { value: sessionData, setValue: setSessionData } = useLocalStorage<{
    session: SessionWithExpiry | null;
    user: User | null;
  }>("auth-state", { session: null, user: null });

  return {
    session: sessionData?.session || null,
    user: sessionData?.user || null,
    isAuthenticated: Boolean(sessionData?.session && sessionData?.user),
    updateAuth: setSessionData,
  };
}
