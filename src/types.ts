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

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
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
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
