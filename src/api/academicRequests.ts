import api from "@/lib/axios";
import type {
  SendAcademicRequestResponse,
  AcademicRequestPayload,
  AcademicRequest,
  GetAcademicRequestsResponse,
} from "@/types/academicRequests";

export async function makeAcademicRequest(
  payload: AcademicRequestPayload,
): Promise<AcademicRequest> {
  const formData = new FormData();

  formData.append("type", payload.type);
  formData.append("subject", payload.subject);
  formData.append("description", payload.description);

  if (payload.department_id) {
    formData.append("department_id", payload.department_id.toString());
  }

  payload.files?.forEach((file) => {
    formData.append("files[]", file);
    // or "files" depending on what your backend expects
  });

  const response = await api.post<SendAcademicRequestResponse>(
    "/api/moodle/academic-requests",
    formData,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getAcademicRequests(): Promise<AcademicRequest[]> {
  const response = await api.get<GetAcademicRequestsResponse>(
    "/api/moodle/academic-requests",
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
