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
