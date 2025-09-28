# Data Model: Create Raycast Extension

## Extension Configuration

### ExtensionManifest

**Purpose**: Defines extension metadata, commands, and preferences for Raycast Store
**Fields**:

- name: string (extension identifier)
- title: string (display name)
- description: string (store description)
- author: string (developer identifier)
- categories: string[] (store categories)
- commands: Command[] (available actions)
- preferences: Preference[] (user settings)
- icon: string (extension icon path)

**Validation Rules**:

- Name must be kebab-case
- Title max 50 characters
- Description max 200 characters
- At least one command required
- Icon must be PNG format

## Command Definitions

### Command

**Purpose**: Individual actions available to users in Raycast
**Fields**:

- name: string (command identifier)
- title: string (display name)
- description: string (command description)
- mode: "view" | "no-view" (UI type)
- icon: string (command icon path)
- keywords: string[] (search terms)

**Validation Rules**:

- Name must be kebab-case
- Mode determines UI requirements
- Icon required for view commands

## User Preferences

### Preference

**Purpose**: User-configurable settings for extension behavior
**Fields**:

- name: string (preference key)
- title: string (display label)
- description: string (help text)
- type: "textfield" | "password" | "checkbox" | "dropdown"
- required: boolean
- default: string | boolean
- placeholder: string (for text inputs)

**Validation Rules**:

- Name must be camelCase
- Required preferences must have validation
- Type determines input component

## Development Configuration

### TypeScriptConfig

**Purpose**: TypeScript compilation settings for Raycast extensions
**Fields**:

- target: "ES2020" (compilation target)
- module: "ESNext" (module system)
- moduleResolution: "node" (resolution strategy)
- strict: true (type checking)
- esModuleInterop: boolean
- allowSyntheticDefaultImports: boolean

### ESLintConfig

**Purpose**: Code quality and style enforcement
**Fields**:

- extends: string[] (base configurations)
- parser: "@typescript-eslint/parser"
- rules: Record<string, any> (linting rules)
- ignorePatterns: string[] (excluded files)

## Asset Management

### Asset

**Purpose**: Static resources used by extension
**Fields**:

- path: string (file location)
- type: "icon" | "image" | "data"
- format: "png" | "jpg" | "json"
- size: number (file size in bytes)

**Validation Rules**:

- Icons must be PNG
- Size limits per asset type
- Path must be relative to assets/

## State Relationships

- ExtensionManifest contains multiple Commands
- ExtensionManifest contains multiple Preferences
- Commands reference Assets for icons
- TypeScriptConfig and ESLintConfig are singletons
- Assets are referenced by Commands and ExtensionManifest
