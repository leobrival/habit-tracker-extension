import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Preferences Configuration Integration Tests', () => {
  const packagePath = path.join(__dirname, '../../package.json');
  let packageContent: any;

  beforeAll(() => {
    packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  });

  test('should have preferences defined in manifest', () => {
    expect(packageContent.preferences).toBeDefined();
    expect(Array.isArray(packageContent.preferences)).toBe(true);
    expect(packageContent.preferences.length).toBeGreaterThan(0);
  });

  test('should have API base URL preference configured', () => {
    const apiBaseUrlPref = packageContent.preferences.find((pref: any) => pref.name === 'apiBaseUrl');

    expect(apiBaseUrlPref).toBeDefined();
    expect(apiBaseUrlPref.title).toBe('API Base URL');
    expect(apiBaseUrlPref.type).toBe('textfield');
    expect(apiBaseUrlPref.required).toBe(true);
    expect(apiBaseUrlPref.default).toBe('http://localhost:61967/api');
    expect(apiBaseUrlPref.placeholder).toBe('http://localhost:61967/api');
  });

  test('should validate preference name format (camelCase)', () => {
    packageContent.preferences.forEach((pref: any) => {
      // Preference names should be camelCase for proper access in code
      expect(pref.name).toMatch(/^[a-z][a-zA-Z0-9]*$/);
    });
  });

  test('should validate preference titles are user-friendly', () => {
    packageContent.preferences.forEach((pref: any) => {
      expect(pref.title).toBeTruthy();
      expect(pref.title.length).toBeGreaterThan(0);
      expect(pref.title.length).toBeLessThan(50); // Keep titles concise
    });
  });

  test('should validate preference types are supported', () => {
    const validTypes = ['textfield', 'password', 'checkbox', 'dropdown'];

    packageContent.preferences.forEach((pref: any) => {
      expect(validTypes).toContain(pref.type);
    });
  });

  test('should validate API URL preference supports backend agnostic principle', () => {
    const apiPref = packageContent.preferences.find((pref: any) => pref.name === 'apiBaseUrl');

    // Constitutional requirement: Backend Agnostic
    expect(apiPref.description).toContain('API');
    expect(apiPref.default).toMatch(/^https?:\/\//); // Should be a valid URL
    expect(apiPref.placeholder).toMatch(/^https?:\/\//); // Should show URL format
  });

  test('should validate required preferences have proper validation', () => {
    const requiredPrefs = packageContent.preferences.filter((pref: any) => pref.required === true);

    requiredPrefs.forEach((pref: any) => {
      expect(pref.title).toBeTruthy();
      expect(pref.description).toBeTruthy();

      // Required preferences should have defaults or clear placeholders
      if (pref.type === 'textfield' || pref.type === 'password') {
        expect(pref.default || pref.placeholder).toBeTruthy();
      }
    });
  });

  test('should support secure storage for sensitive preferences', () => {
    const passwordPrefs = packageContent.preferences.filter((pref: any) => pref.type === 'password');

    // If we have password preferences, they should be properly configured
    passwordPrefs.forEach((pref: any) => {
      expect(pref.title).toBeTruthy();
      expect(pref.description).toBeTruthy();
    });
  });

  test('should fail when preference access utilities do not exist', () => {
    // This should fail initially (TDD approach)
    // We'll need utilities to access preferences in the auth service
    const authServicePath = path.join(__dirname, '../../src/auth-service.ts');
    expect(fs.existsSync(authServicePath)).toBe(false);
  });

  test('should validate preference descriptions provide clear guidance', () => {
    packageContent.preferences.forEach((pref: any) => {
      if (pref.description) {
        expect(pref.description.length).toBeGreaterThan(10);
        expect(pref.description.length).toBeLessThan(200);
      }
    });
  });

  test('should ensure preferences support constitutional requirements', () => {
    const apiPref = packageContent.preferences.find((pref: any) => pref.name === 'apiBaseUrl');

    // Constitutional requirements validation
    expect(apiPref).toBeDefined(); // Backend Agnostic principle
    expect(apiPref.required).toBe(true); // Must be configured
    expect(apiPref.type).toBe('textfield'); // User configurable
  });
});