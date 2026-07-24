import axios from "axios";
import api from "@/lib/axios";
import type {
  CourseAssignmentPayload,
  CourseAssignmentResponse,
  GradeAndFeedbackPayload,
  Submission,
} from "@/types/course";

const getApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : "Something went wrong.";
  }

  const data = error.response?.data;
  if (typeof data === "string") {
    const plainText = data.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return plainText || error.message;
  }

  if (data && typeof data === "object") {
    const payload = data as { message?: string; errors?: Record<string, string[] | string> };
    const fieldErrors = payload.errors
      ? Object.values(payload.errors).flatMap((value) =>
          Array.isArray(value) ? value : [value],
        )
      : [];
    if (fieldErrors.length) return fieldErrors.join("\n");
    if (payload.message) return payload.message;
  }

  return error.response
    ? `Request failed (${error.response.status}).`
    : "Could not reach the server. Check the API URL and your connection.";
};

const toFormData = (payload: CourseAssignmentPayload) => {
  const formData = new FormData();
  formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  formData.append("due_at", payload.due_at);
  formData.append("weight", String(payload.weight));
  formData.append("max_mark", String(payload.max_mark));
  payload.files?.forEach((file) => formData.append("files[]", file));
  return formData;
};

export async function addAssignment(
  sectionId: string | number,
  payload: CourseAssignmentPayload,
): Promise<CourseAssignmentResponse> {
  try {
    const response = await api.post(
      `/api/moodle/course-sections/${sectionId}/submissions`,
      toFormData(payload),
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const { success, message, data } = response.data;
    if (!success) throw new Error(message);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function viewAssignments(
  sectionId: string | null,
): Promise<Submission[]> {
  const response = await api.get(
    `/api/moodle/course-sections/${sectionId}/submissions`,
  );
  const { success, message, data } = response.data;
  if (!success) throw new Error(message);
  return data;
}

export async function viewAssignment(
  sectionSubmissionId: string | number,
): Promise<Submission> {
  const response = await api.get(
    `/api/moodle/section-submissions/${sectionSubmissionId}`,
  );
  const { success, message, data } = response.data;
  if (!success) throw new Error(message);
  return data;
}

export async function deleteAssignment(sectionSubmissionId: string | number) {
  try {
    const response = await api.delete(
      `/api/moodle/section-submissions/${sectionSubmissionId}`,
    );
    const { success, message, data } = response.data;
    if (!success) throw new Error(message);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateAssignment(
  sectionSubmissionId: string | number,
  payload: CourseAssignmentPayload,
) {
  try {
    const formData = toFormData(payload);
    const response = await api.put(
      `/api/moodle/section-submissions/${sectionSubmissionId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const { success, message, data } = response.data;
    if (!success) throw new Error(message);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function deleteAssignmentAttachment(attachmentId: string | number) {
  try {
    const response = await api.delete(
      `/api/moodle/section-submission-attachments/${attachmentId}`,
    );
    const { success, message, data } = response.data;
    if (!success) throw new Error(message);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function gradeAndFeedback(
  submissionId: string | number,
  payload: GradeAndFeedbackPayload,
) {
  const response = await api.put(
    `api/moodle/student-submissions/${submissionId}/grade`,
    payload,
  );
  const { success, message, data } = response.data;
  if (!success) throw new Error(message);
  return data;
}
