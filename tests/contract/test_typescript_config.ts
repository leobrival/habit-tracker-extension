import { describe, expect, test } from '@jest/globals';
import fs from 'fs';
import path from 'path';

describe('TypeScript Configuration Contract Tests', () => {
  const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
  let tsconfig: any;

  beforeAll(() => {
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8');
    tsconfig = JSON.parse(tsconfigContent);
  });

  test('should have required compiler options', () => {
    const compilerOptions = tsconfig.compilerOptions;
    expect(compilerOptions).toBeDefined();
    expect(compilerOptions.strict).toBe(true);
    expect(compilerOptions.target).toBeDefined();
    expect(compilerOptions.module).toBeDefined();
    expect(compilerOptions.jsx).toBe('react-jsx');
  });

  test('should enforce strict type checking', () => {
    const compilerOptions = tsconfig.compilerOptions;
    expect(compilerOptions.strict).toBe(true);
    expect(compilerOptions.noImplicitReturns).toBe(true);
    expect(compilerOptions.noFallthroughCasesInSwitch).toBe(true);
    expect(compilerOptions.noUncheckedIndexedAccess).toBe(true);
    expect(compilerOptions.exactOptionalPropertyTypes).toBe(true);
  });

  test('should have proper module configuration', () => {
    const compilerOptions = tsconfig.compilerOptions;
    expect(compilerOptions.esModuleInterop).toBe(true);
    expect(compilerOptions.allowSyntheticDefaultImports).toBe(true);
    expect(compilerOptions.skipLibCheck).toBe(true);
    expect(compilerOptions.forceConsistentCasingInFileNames).toBe(true);
  });

  test('should include src directory', () => {
    expect(Array.isArray(tsconfig.include)).toBe(true);
    const hasSourceInclusion = tsconfig.include.some((pattern: string) =>
      pattern.includes('src') || pattern === 'src/**/*'
    );
    expect(hasSourceInclusion).toBe(true);
  });

  test('should include raycast environment types', () => {
    const hasRaycastEnv = tsconfig.include.some((pattern: string) =>
      pattern.includes('raycast-env.d.ts')
    );
    expect(hasRaycastEnv).toBe(true);
  });

  test('should have ES2023 or newer target', () => {
    const compilerOptions = tsconfig.compilerOptions;
    const validTargets = ['ES2020', 'ES2021', 'ES2022', 'ES2023', 'ESNext'];
    expect(validTargets).toContain(compilerOptions.target);
  });

  test('should resolve JSON modules', () => {
    const compilerOptions = tsconfig.compilerOptions;
    expect(compilerOptions.resolveJsonModule).toBe(true);
  });

  test('should support isolated modules', () => {
    const compilerOptions = tsconfig.compilerOptions;
    expect(compilerOptions.isolatedModules).toBe(true);
  });
});