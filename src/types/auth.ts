import type { ApiResponse } from "@/types/api";

export type UserRole = "STUDENT" | "LECTURER";

export interface ScopeUniversity {
  id: number;
  name: string;
}

export interface ScopeFaculty {
  id: number;
  name: string;
  university?: ScopeUniversity;
}

export interface ScopeDepartment {
  id: number;
  name: string;
  faculty?: ScopeFaculty;
}

export type ScopeEntity = ScopeUniversity | ScopeFaculty | ScopeDepartment;

export type UserScopeType = "UNIVERSITY" | "FACULTY" | "DEPARTMENT";

export interface UserRoleEntry {
  id: number;
  name: UserRole;
}

export interface UserScopeEntry {
  id: number;
  role: UserRoleEntry;
  scope_type: UserScopeType;
  scope_id: number | null;
  scope?: ScopeEntity | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  is_active: number;
  is_two_factor_enabled: number;
  roles: UserRoleEntry[];
  scopes: UserScopeEntry[];
  created_at: string;
  updated_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type LoginResponse = ApiResponse<{ user: User; token: string }>;
export type LogoutResponse = ApiResponse<null>;
export type GetProfileResponse = ApiResponse<User>;
