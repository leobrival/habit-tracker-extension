export interface User {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: number;
  name: string;
  description: string;
  userId: number;
  user?: User;
  checkIns?: CheckIn[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckIn {
  id: number;
  boardId: number;
  userId: number;
  checkDate: string;
  notes: string;
  completed: boolean;
  user?: User;
  board?: Board;
  createdAt: string;
  updatedAt: string;
}

export interface SupabaseSession {
  access_token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  session: SupabaseSession;
}

export interface RegisterResponse {
  message: string;
  user: User;
  session: SupabaseSession;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Extension Configuration Types

export interface ExtensionManifest {
  $schema: string;
  name: string;
  title: string;
  description: string;
  author: string;
  platforms: Platform[];
  categories: Category[];
  license: string;
  icon: string;
  commands: Command[];
  preferences?: Preference[];
  dependencies: Dependencies;
  devDependencies: DevDependencies;
  scripts: Scripts;
}

export type Platform = "macOS" | "Windows";

export type Category = "Productivity" | "Data" | "Developer Tools" | "Media" | "Communication" | "Finance" | "Other";

// Command Types

export interface Command {
  name: string;
  title: string;
  description: string;
  mode: CommandMode;
  icon?: string;
  keywords?: string[];
}

export type CommandMode = "view" | "no-view";

// Preference Types

export interface Preference {
  name: string;
  title: string;
  description?: string;
  type: PreferenceType;
  required?: boolean;
  default?: string | boolean;
  placeholder?: string;
}

export type PreferenceType = "textfield" | "password" | "checkbox" | "dropdown";

// Dependency Types

export interface Dependencies {
  "@raycast/api": string;
  "@raycast/utils"?: string;
  [key: string]: string | undefined;
}

export interface DevDependencies {
  "@raycast/eslint-config": string;
  "@types/node": string;
  "@types/react": string;
  eslint: string;
  prettier: string;
  typescript: string;
  jest?: string;
  "@types/jest"?: string;
  [key: string]: string | undefined;
}

export interface Scripts {
  build: string;
  dev: string;
  lint: string;
  "fix-lint"?: string;
  test?: string;
  "test:watch"?: string;
  publish: string;
  prepublishOnly?: string;
  [key: string]: string | undefined;
}

// Asset Types

export interface Asset {
  path: string;
  type: AssetType;
  format: AssetFormat;
  size?: number;
}

export type AssetType = "icon" | "image" | "data";
export type AssetFormat = "png" | "jpg" | "json";

// Validation Interfaces

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

export interface ManifestValidationResult {
  isValid: boolean;
  errors: ValidationRule[];
  warnings: ValidationRule[];
}
