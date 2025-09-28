import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Extension Loading Integration Tests', () => {
  test('should have valid package.json for Raycast loading', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    expect(fs.existsSync(packagePath)).toBe(true);

    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    // Essential fields for extension loading
    expect(packageContent.$schema).toContain('raycast.com/schemas/extension.json');
    expect(packageContent.name).toBeTruthy();
    expect(packageContent.title).toBeTruthy();
    expect(packageContent.commands).toBeDefined();
    expect(Array.isArray(packageContent.commands)).toBe(true);
  });

  test('should have TypeScript configuration for compilation', () => {
    const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.strict).toBe(true);
  });

  test('should have required Raycast dependencies', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    expect(packageContent.dependencies['@raycast/api']).toBeDefined();
    expect(packageContent.devDependencies['@raycast/eslint-config']).toBeDefined();
    expect(packageContent.devDependencies.typescript).toBeDefined();
  });

  test('should have extension icon file', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    const iconPath = path.join(__dirname, '../../assets', packageContent.icon);
    expect(fs.existsSync(iconPath)).toBe(true);
  });

  test('should have build script for Raycast CLI', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    expect(packageContent.scripts.build).toBe('ray build');
    expect(packageContent.scripts.dev).toBe('ray develop');
  });

  test('should have valid command definitions for loading', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    packageContent.commands.forEach((command: any) => {
      expect(command.name).toMatch(/^[a-z0-9-]+$/);
      expect(command.title).toBeTruthy();
      expect(command.description).toBeTruthy();
      expect(['view', 'no-view']).toContain(command.mode);
    });
  });

  test('should have preferences configured correctly if present', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    if (packageContent.preferences) {
      packageContent.preferences.forEach((pref: any) => {
        expect(pref.name).toBeTruthy();
        expect(pref.title).toBeTruthy();
        expect(pref.type).toBeTruthy();

        // Name should be camelCase for proper preference access
        expect(pref.name).toMatch(/^[a-z][a-zA-Z0-9]*$/);
      });
    }
  });

  test('should fail when trying to load non-existent command files', () => {
    const packagePath = path.join(__dirname, '../../package.json');
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

    // This test should fail until we implement the actual command files
    packageContent.commands.forEach((command: any) => {
      const commandPath = path.join(__dirname, '../../src', `${command.name}.tsx`);
      // This should initially fail (TDD approach)
      expect(fs.existsSync(commandPath)).toBe(false);
    });
  });
});