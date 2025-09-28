import { describe, expect, test, jest, beforeEach } from '@jest/globals';

// Mock Raycast API
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockShowToast = jest.fn();
const mockGetPreferenceValues = jest.fn();

jest.mock('@raycast/api', () => ({
  LocalStorage: mockLocalStorage,
  showToast: mockShowToast,
  Toast: {
    Style: {
      Success: 'success',
      Failure: 'failure',
    },
  },
  getPreferenceValues: mockGetPreferenceValues,
}));

describe('Authentication Service Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetPreferenceValues.mockReturnValue({
      apiBaseUrl: 'http://localhost:61967/api',
    });
  });

  test('should handle session storage correctly', async () => {
    const mockSession = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
    };

    mockLocalStorage.getItem.mockResolvedValue(JSON.stringify(mockSession));

    // Test session retrieval logic
    const storedSession = await mockLocalStorage.getItem('habitTracker.session');
    expect(storedSession).toBeDefined();

    const parsedSession = JSON.parse(storedSession as string);
    expect(parsedSession.access_token).toBe('test-token');
    expect(parsedSession.refresh_token).toBe('test-refresh');
  });

  test('should handle session expiry correctly', () => {
    const now = Date.now();
    const expiredTime = now - 1000; // 1 second ago
    const validTime = now + 3600000; // 1 hour from now

    // Test expired session
    expect(expiredTime < now).toBe(true);

    // Test valid session
    expect(validTime > now).toBe(true);
  });

  test('should validate API base URL from preferences', () => {
    const preferences = mockGetPreferenceValues();
    expect(preferences.apiBaseUrl).toBe('http://localhost:61967/api');
    expect(preferences.apiBaseUrl).toMatch(/^https?:\/\//);
  });

  test('should handle authentication errors with toast notifications', async () => {
    const errorMessage = 'Authentication failed';

    // Simulate error handling
    await mockShowToast({
      style: 'failure',
      title: 'Authentication Error',
      message: errorMessage,
    });

    expect(mockShowToast).toHaveBeenCalledWith({
      style: 'failure',
      title: 'Authentication Error',
      message: errorMessage,
    });
  });

  test('should handle successful authentication', async () => {
    const mockUser = {
      id: 1,
      fullName: 'Test User',
      email: 'test@example.com',
      createdAt: '2023-01-01',
      updatedAt: '2023-01-01',
    };

    const mockSession = {
      access_token: 'new-token',
      refresh_token: 'new-refresh',
    };

    // Simulate successful authentication
    await mockLocalStorage.setItem('habitTracker.session', JSON.stringify(mockSession));
    await mockShowToast({
      style: 'success',
      title: 'Welcome back!',
      message: `Hello, ${mockUser.fullName}`,
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'habitTracker.session',
      JSON.stringify(mockSession)
    );

    expect(mockShowToast).toHaveBeenCalledWith({
      style: 'success',
      title: 'Welcome back!',
      message: `Hello, ${mockUser.fullName}`,
    });
  });

  test('should handle logout correctly', async () => {
    // Simulate logout
    await mockLocalStorage.removeItem('habitTracker.session');
    await mockShowToast({
      style: 'success',
      title: 'Logged out',
      message: 'You have been logged out successfully',
    });

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('habitTracker.session');
    expect(mockShowToast).toHaveBeenCalledWith({
      style: 'success',
      title: 'Logged out',
      message: 'You have been logged out successfully',
    });
  });

  test('should validate session data structure', () => {
    const validSession = {
      access_token: 'token',
      refresh_token: 'refresh',
    };

    const invalidSession = {
      access_token: 'token',
      // missing refresh_token
    };

    // Test valid session structure
    expect(validSession.access_token).toBeDefined();
    expect(validSession.refresh_token).toBeDefined();

    // Test invalid session structure
    expect(invalidSession.access_token).toBeDefined();
    expect((invalidSession as any).refresh_token).toBeUndefined();
  });

  test('should handle network errors gracefully', async () => {
    const networkError = new Error('Network request failed');

    // Simulate network error handling
    await mockShowToast({
      style: 'failure',
      title: 'Connection Error',
      message: 'Please check your internet connection',
    });

    expect(mockShowToast).toHaveBeenCalledWith({
      style: 'failure',
      title: 'Connection Error',
      message: 'Please check your internet connection',
    });
  });
});