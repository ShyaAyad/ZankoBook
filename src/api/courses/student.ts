import api from "@/lib/axios";
import type {
  StudentSubmission,
  StudentSubmissionPayload,
} from "@/types/submission";

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

export async function getCourseSections(id: string) {
  const response = await api.get(`/api/moodle/courses/${id}/sections`);

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function uploadSectionSubmission(
  submissionId: string | number,
  payload: StudentSubmissionPayload,
) {
  const formData = new FormData();
  if (payload.files)
    payload.files.forEach((file) => {
      formData.append("files[]", file);
    });

  const response = await api.post(
    `/api/moodle/section-submissions/${submissionId}/submit`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getMySubmission(
  submissionId: string | number,
): Promise<StudentSubmission[]> {
  const response = await api.get(
    `/api/moodle/section-submissions/${submissionId}/my-submission`,
  );

  const { success, message, data } = response.data;

  if (!data) return [];

  if (!success) throw new Error(message);

  return data as StudentSubmission[];
}

export async function deleteUploadedSubmission(submissionId: string | number) {
  const response = await api.delete(
    `/api/moodle/student-submissions/${submissionId}`,
  );

  const { success, message, data } = response.data;

  if (!data) return;

  if (!success) throw new Error(message);

  return data;
}
