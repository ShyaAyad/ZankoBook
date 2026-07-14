import api from "@/lib/axios";
import type { CourseSection, CourseSectionPayload } from "@/types/course";

export async function addSection(
  courseId: string | number,
  payload: CourseSectionPayload,
): Promise<CourseSection> {
  const response = await api.post(
    `api/moodle/courses/${courseId}/sections`,
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function updateSection(
  id: string | number,
  payload: CourseSectionPayload,
): Promise<CourseSection> {
  const response = await api.put(`api/moodle/course-sections/${id}`, payload);

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function deleteSection(id: string | number) {
  const response = await api.delete(`api/moodle/course-sections/${id}`);

  if (!response.data) return;

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
