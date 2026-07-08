import api from "@/lib/axios";
import type { LoginPayload, User, LoginResponse } from "@/types/auth";

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
