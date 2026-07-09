import api from "@/lib/axios";
import type {
  SendAcademicRequestResponse,
  AcademicRequestPayload,
  AcademicRequest,
} from "@/types/academicRequests";

export async function makeAcademicRequest(
  payload: AcademicRequestPayload,
): Promise<AcademicRequest> {
  const response = await api.post<SendAcademicRequestResponse>(
    "/api/moodle/academic-requests",
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
