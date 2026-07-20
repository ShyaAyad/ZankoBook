import api from "@/lib/axios";
import type { MarksPayload } from "@/types/grades";
import type { StudentSubmission } from "@/types/submission";

export async function courses() {
  const response = await api.get("/api/moodle/lecturer/courses");
  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getCourseById(id: string) {
  const response = await api.get(`/api/moodle/lecturer/courses/${id}`);
  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data.course;
}

export async function getCourseSubmissionSummary(id: string) {
  const response = await api.get(
    `/api/moodle/lecturer/courses/${id}/submissions-summary`,
  );
  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getCourseSections(id: string) {
  const response = await api.get(`/api/moodle/courses/${id}/sections`);
  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data.data;
}

export async function getStudentSubmissions(
  submissionId: string | number,
): Promise<StudentSubmission[]> {
  const response = await api.get(
    `/api/moodle/section-submissions/${submissionId}/student-submissions`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function saveMarks(
  assessmentId: string | number,
  payload: MarksPayload,
) {
  const response = await api.post(
    `/api/moodle/course-assessments/${assessmentId}/marks/bulk`,
    payload,
  );
  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
