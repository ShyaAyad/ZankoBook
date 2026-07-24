import axios from "axios";
import api from "@/lib/axios";
import type { StudentSubmission, StudentSubmissionPayload } from "@/types/submission";
import type { CourseSection, GetCourseSectionsResponse } from "@/types/course";

const getApiErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return error instanceof Error ? error.message : "Something went wrong.";
  const data = error.response?.data;
  if (typeof data === "string") {
    const text = data.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return text || error.message;
  }
  if (data && typeof data === "object") {
    const body = data as { message?: string; errors?: Record<string, string[] | string> };
    const errors = body.errors
      ? Object.values(body.errors).flatMap((value) => (Array.isArray(value) ? value : [value]))
      : [];
    if (errors.length) return errors.join("\n");
    if (body.message) return body.message;
  }
  return error.response ? `Request failed (${error.response.status}).` : "Could not reach the server. Check the API URL and your connection.";
};

export async function courses() {
  const response = await api.get("/api/moodle/my-courses");
  const { success, message, data } = response.data;
  if (!success) throw new Error(message);
  return data;
}

export async function getCourseById(id: string) {
  const response = await api.get(`/api/moodle/my-courses/${id}`);
  const { success, message, data } = response.data;
  if (!success) throw new Error(message);
  return data;
}

export async function getCourseSections(id: string): Promise<CourseSection[]> {
  const response = await api.get<GetCourseSectionsResponse>(`/api/moodle/courses/${id}/sections`);
  const { success, message, data } = response.data;
  if (!success) throw new Error(message);
  return data;
}

export async function uploadSectionSubmission(submissionId: string | number, payload: StudentSubmissionPayload) {
  try {
    const formData = new FormData();
    payload.files.forEach((file) => formData.append("files[]", file));
    const response = await api.post(`/api/moodle/section-submissions/${submissionId}/submit`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { success, message, data } = response.data;
    if (!success) throw new Error(message);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getMySubmission(submissionId: string | number): Promise<StudentSubmission[]> {
  const response = await api.get(`/api/moodle/section-submissions/${submissionId}/my-submission`);
  const { success, message, data } = response.data;
  if (!success) throw new Error(message);
  return Array.isArray(data) ? data : [];
}

export async function deleteUploadedSubmission(studentSubmissionId: string | number) {
  try {
    const response = await api.delete(`/api/moodle/student-submissions/${studentSubmissionId}`);
    const { success, message, data } = response.data;
    if (!success) throw new Error(message);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
