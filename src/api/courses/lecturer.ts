import api from "@/lib/axios";

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

export async function getCourseLectuers(courseId: string | number) {
  const response = await api.get(`/api/moodle/courses/${courseId}/teachers`);

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
