import { describe, expect, test } from '@jest/globals';
import type {
  ExtensionManifest,
  Command,
  CommandMode,
  Preference,
  PreferenceType,
  Platform,
  Category,
  Asset,
  AssetType,
  AssetFormat,
  ValidationRule,
  ManifestValidationResult,
  User,
  Board,
  CheckIn,
  SupabaseSession,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  ApiError,
} from '../../src/types';

describe('Type Definitions Unit Tests', () => {
  describe('Extension Configuration Types', () => {
    test('should validate ExtensionManifest interface', () => {
      const manifest: ExtensionManifest = {
        $schema: 'https://www.raycast.com/schemas/extension.json',
        name: 'test-extension',
        title: 'Test Extension',
        description: 'A test extension',
        author: 'test-author',
        platforms: ['macOS', 'Windows'],
        categories: ['Productivity'],
        license: 'MIT',
        icon: 'extension-icon.png',
        commands: [],
        dependencies: {
          '@raycast/api': '^1.0.0',
        },
        devDependencies: {
          '@raycast/eslint-config': '^1.0.0',
          '@types/node': '^18.0.0',
          '@types/react': '^18.0.0',
          eslint: '^8.0.0',
          prettier: '^2.0.0',
          typescript: '^4.0.0',
        },
        scripts: {
          build: 'ray build',
          dev: 'ray develop',
          lint: 'ray lint',
          publish: 'ray publish',
        },
      };

      expect(manifest.name).toBe('test-extension');
      expect(manifest.platforms).toContain('macOS');
      expect(manifest.categories).toContain('Productivity');
    });

    test('should validate Command interface', () => {
      const command: Command = {
        name: 'test-command',
        title: 'Test Command',
        description: 'A test command',
        mode: 'view',
      };

      expect(command.name).toBe('test-command');
      expect(command.mode).toBe('view');
    });

    test('should validate CommandMode type', () => {
      const viewMode: CommandMode = 'view';
      const noViewMode: CommandMode = 'no-view';

      expect(viewMode).toBe('view');
      expect(noViewMode).toBe('no-view');
    });

    test('should validate Platform type', () => {
      const macOS: Platform = 'macOS';
      const windows: Platform = 'Windows';

      expect(macOS).toBe('macOS');
      expect(windows).toBe('Windows');
    });

    test('should validate Category type', () => {
      const categories: Category[] = [
        'Productivity',
        'Data',
        'Developer Tools',
        'Media',
        'Communication',
        'Finance',
        'Other',
      ];

      expect(categories).toHaveLength(7);
      expect(categories).toContain('Productivity');
      expect(categories).toContain('Developer Tools');
    });
  });

  describe('Preference Types', () => {
    test('should validate Preference interface', () => {
      const preference: Preference = {
        name: 'apiBaseUrl',
        title: 'API Base URL',
        description: 'The base URL for the API',
        type: 'textfield',
        required: true,
        default: 'http://localhost:3000',
      };

      expect(preference.name).toBe('apiBaseUrl');
      expect(preference.type).toBe('textfield');
      expect(preference.required).toBe(true);
    });

    test('should validate PreferenceType type', () => {
      const types: PreferenceType[] = [
        'textfield',
        'password',
        'checkbox',
        'dropdown',
      ];

      expect(types).toHaveLength(4);
      expect(types).toContain('textfield');
      expect(types).toContain('password');
    });
  });

  describe('Asset Types', () => {
    test('should validate Asset interface', () => {
      const asset: Asset = {
        path: 'assets/icon.png',
        type: 'icon',
        format: 'png',
        size: 1024,
      };

      expect(asset.path).toBe('assets/icon.png');
      expect(asset.type).toBe('icon');
      expect(asset.format).toBe('png');
    });

    test('should validate AssetType type', () => {
      const types: AssetType[] = ['icon', 'image', 'data'];

      expect(types).toHaveLength(3);
      expect(types).toContain('icon');
      expect(types).toContain('image');
    });

    test('should validate AssetFormat type', () => {
      const formats: AssetFormat[] = ['png', 'jpg', 'json'];

      expect(formats).toHaveLength(3);
      expect(formats).toContain('png');
      expect(formats).toContain('jpg');
    });
  });

  describe('Validation Types', () => {
    test('should validate ValidationRule interface', () => {
      const rule: ValidationRule = {
        field: 'name',
        rule: 'required',
        message: 'Name is required',
      };

      expect(rule.field).toBe('name');
      expect(rule.rule).toBe('required');
      expect(rule.message).toBe('Name is required');
    });

    test('should validate ManifestValidationResult interface', () => {
      const result: ManifestValidationResult = {
        isValid: true,
        errors: [],
        warnings: [
          {
            field: 'description',
            rule: 'length',
            message: 'Description could be more detailed',
          },
        ],
      };

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(1);
    });
  });

  describe('Application Data Types', () => {
    test('should validate User interface', () => {
      const user: User = {
        id: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(user.id).toBe(1);
      expect(user.fullName).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });

    test('should validate Board interface', () => {
      const board: Board = {
        id: 1,
        name: 'Daily Habits',
        description: 'My daily routine',
        userId: 1,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(board.id).toBe(1);
      expect(board.name).toBe('Daily Habits');
      expect(board.userId).toBe(1);
    });

    test('should validate CheckIn interface', () => {
      const checkIn: CheckIn = {
        id: 1,
        boardId: 1,
        userId: 1,
        checkDate: '2023-01-01',
        notes: 'Completed workout',
        completed: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      expect(checkIn.id).toBe(1);
      expect(checkIn.completed).toBe(true);
      expect(checkIn.notes).toBe('Completed workout');
    });
  });

  describe('Authentication Types', () => {
    test('should validate SupabaseSession interface', () => {
      const session: SupabaseSession = {
        access_token: 'access-token-123',
        refresh_token: 'refresh-token-456',
      };

      expect(session.access_token).toBe('access-token-123');
      expect(session.refresh_token).toBe('refresh-token-456');
    });

    test('should validate LoginRequest interface', () => {
      const loginRequest: LoginRequest = {
        email: 'user@example.com',
        password: 'password123',
      };

      expect(loginRequest.email).toBe('user@example.com');
      expect(loginRequest.password).toBe('password123');
    });

    test('should validate RegisterRequest interface', () => {
      const registerRequest: RegisterRequest = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      expect(registerRequest.fullName).toBe('John Doe');
      expect(registerRequest.email).toBe('john@example.com');
      expect(registerRequest.password).toBe('password123');
    });

    test('should validate AuthResponse interface', () => {
      const authResponse: AuthResponse = {
        message: 'Login successful',
        user: {
          id: 1,
          fullName: 'John Doe',
          email: 'john@example.com',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        session: {
          access_token: 'access-token',
          refresh_token: 'refresh-token',
        },
      };

      expect(authResponse.message).toBe('Login successful');
      expect(authResponse.user.id).toBe(1);
      expect(authResponse.session.access_token).toBe('access-token');
    });
  });

  describe('Error Types', () => {
    test('should validate ApiError class', () => {
      const error = new ApiError('Not found', 404);

      expect(error.message).toBe('Not found');
      expect(error.status).toBe(404);
      expect(error.name).toBe('ApiError');
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('Type Safety Tests', () => {
    test('should enforce type constraints', () => {
      // This test verifies TypeScript compilation catches type errors
      const validCommand: Command = {
        name: 'valid-name',
        title: 'Valid Title',
        description: 'Valid description',
        mode: 'view',
      };

      // These should be valid assignments
      expect(validCommand.mode).toBe('view');

      // Test optional properties
      const commandWithOptionals: Command = {
        ...validCommand,
        icon: 'icon.png',
        keywords: ['habit', 'tracker'],
      };

      expect(commandWithOptionals.icon).toBe('icon.png');
      expect(commandWithOptionals.keywords).toContain('habit');
    });
  });
});