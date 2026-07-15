import api from "@/lib/axios";

export async function addAssessment(courseId: string | number) {
  const response = await api.post(`api/moodle/courses/${courseId}/assessments`);

  const { data, success, message } = response.data;

  if (!success) return message;

  return data;
}
