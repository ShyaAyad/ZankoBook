import api from "@/lib/axios";
import type {
  LoginPayload,
  User,
  LoginResponse,
  GetProfileResponse,
  LogoutResponse,
} from "@/types/auth";

export async function login(
  payload: LoginPayload,
): Promise<{ user: User; token: string }> {
  const response = await api.post<LoginResponse>(
    "/api/auth/moodle/login",
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function logout(): Promise<string> {
  const response = await api.post<LogoutResponse>("/api/auth/logout");

  const { success, message } = response.data;

  if (!success) {
    throw new Error(message || "Logout failed");
  }

  return message;
}

export async function getProfile(): Promise<User> {
  const response = await api.get<GetProfileResponse>("/api/auth/me");

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
