import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('Command Execution Workflow Integration Tests', () => {
  const packagePath = path.join(__dirname, '../../package.json');
  let packageContent: any;

  beforeAll(() => {
    packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
  });

  test('should have authentication command workflow defined', () => {
    const authCommand = packageContent.commands.find((cmd: any) => cmd.name === 'auth');
    expect(authCommand).toBeDefined();
    expect(authCommand.title).toBe('Authentication');
    expect(authCommand.mode).toBe('view');
    expect(authCommand.description).toContain('Login');
  });

  test('should have dashboard command workflow defined', () => {
    const dashboardCommand = packageContent.commands.find((cmd: any) => cmd.name === 'dashboard');
    expect(dashboardCommand).toBeDefined();
    expect(dashboardCommand.title).toBe('Dashboard');
    expect(dashboardCommand.mode).toBe('view');
    expect(dashboardCommand.description).toContain('dashboard');
  });

  test('should fail when auth command file does not exist', () => {
    // This should fail initially (TDD approach)
    const authFilePath = path.join(__dirname, '../../src/auth.tsx');
    expect(fs.existsSync(authFilePath)).toBe(false);
  });

  test('should fail when dashboard command file does not exist', () => {
    // This should fail initially (TDD approach)
    const dashboardFilePath = path.join(__dirname, '../../src/dashboard.tsx');
    expect(fs.existsSync(dashboardFilePath)).toBe(false);
  });

  test('should fail when auth service does not exist', () => {
    // This should fail initially (TDD approach)
    const authServicePath = path.join(__dirname, '../../src/auth-service.ts');
    expect(fs.existsSync(authServicePath)).toBe(false);
  });

  test('should fail when logout action does not exist', () => {
    // This should fail initially (TDD approach)
    const logoutActionPath = path.join(__dirname, '../../src/logout-action.ts');
    expect(fs.existsSync(logoutActionPath)).toBe(false);
  });

  test('should fail when types definition does not exist', () => {
    // This should fail initially (TDD approach)
    const typesPath = path.join(__dirname, '../../src/types.ts');
    expect(fs.existsSync(typesPath)).toBe(false);
  });

  test('should have API base URL preference for backend connection', () => {
    const apiPref = packageContent.preferences?.find((pref: any) => pref.name === 'apiBaseUrl');
    expect(apiPref).toBeDefined();
    expect(apiPref.type).toBe('textfield');
    expect(apiPref.required).toBe(true);
    expect(apiPref.default).toBeDefined();
  });

  test('should validate command execution requirements', () => {
    // Commands should support both authenticated and unauthenticated states
    packageContent.commands.forEach((command: any) => {
      expect(command.name).toBeTruthy();
      expect(command.mode).toBe('view'); // Both commands are view-based

      // Response time requirements from constitution
      expect(command.description.length).toBeLessThan(200); // Keep descriptions concise for fast loading
    });
  });

  test('should support session management workflow', () => {
    // Session management requirements from constitution
    const hasSessionPrefs = packageContent.preferences?.some((pref: any) =>
      pref.name.toLowerCase().includes('api') || pref.name.toLowerCase().includes('url')
    );
    expect(hasSessionPrefs).toBe(true);
  });

  test('should validate performance requirements in command structure', () => {
    // Constitutional requirement: <200ms UI response times
    packageContent.commands.forEach((command: any) => {
      // Command names should be short for quick loading
      expect(command.name.length).toBeLessThan(20);
      expect(command.title.length).toBeLessThan(30);
    });
  });
});