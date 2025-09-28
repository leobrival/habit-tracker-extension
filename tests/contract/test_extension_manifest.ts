import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Extension Manifest Contract Tests', () => {
  const packageJsonPath = path.join(__dirname, '../../package.json');
  let packageJson: any;

  beforeAll(() => {
    const packageContent = fs.readFileSync(packageJsonPath, 'utf-8');
    packageJson = JSON.parse(packageContent);
  });

  test('should have required manifest fields', () => {
    expect(packageJson.name).toBeDefined();
    expect(packageJson.title).toBeDefined();
    expect(packageJson.description).toBeDefined();
    expect(packageJson.author).toBeDefined();
    expect(packageJson.categories).toBeDefined();
    expect(packageJson.commands).toBeDefined();
    expect(packageJson.icon).toBeDefined();
  });

  test('should have valid extension name format', () => {
    expect(packageJson.name).toMatch(/^[a-z0-9-]+$/);
    expect(packageJson.name.length).toBeGreaterThan(0);
  });

  test('should have valid title length', () => {
    expect(packageJson.title.length).toBeLessThanOrEqual(50);
    expect(packageJson.title.length).toBeGreaterThan(0);
  });

  test('should have valid description length', () => {
    expect(packageJson.description.length).toBeLessThanOrEqual(200);
    expect(packageJson.description.length).toBeGreaterThan(0);
  });

  test('should have at least one command', () => {
    expect(Array.isArray(packageJson.commands)).toBe(true);
    expect(packageJson.commands.length).toBeGreaterThan(0);
  });

  test('should have valid command structure', () => {
    packageJson.commands.forEach((command: any) => {
      expect(command.name).toBeDefined();
      expect(command.title).toBeDefined();
      expect(command.description).toBeDefined();
      expect(command.mode).toBeDefined();
      expect(['view', 'no-view']).toContain(command.mode);
    });
  });

  test('should have valid categories', () => {
    expect(Array.isArray(packageJson.categories)).toBe(true);
    expect(packageJson.categories.length).toBeGreaterThan(0);

    const validCategories = [
      'Productivity', 'Data', 'Developer Tools',
      'Media', 'Communication', 'Finance', 'Other'
    ];

    packageJson.categories.forEach((category: string) => {
      expect(validCategories).toContain(category);
    });
  });

  test('should have PNG icon', () => {
    expect(packageJson.icon).toMatch(/\.png$/);
  });

  test('should have required dependencies', () => {
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies['@raycast/api']).toBeDefined();
  });

  test('should have preferences with correct structure if defined', () => {
    if (packageJson.preferences) {
      expect(Array.isArray(packageJson.preferences)).toBe(true);

      packageJson.preferences.forEach((pref: any) => {
        expect(pref.name).toBeDefined();
        expect(pref.title).toBeDefined();
        expect(pref.type).toBeDefined();
        expect(['textfield', 'password', 'checkbox', 'dropdown']).toContain(pref.type);
      });
    }
  });
});