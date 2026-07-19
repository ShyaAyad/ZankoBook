import { type CourseStudent } from "@/types/attendance";
import api from "@/lib/axios";
import type { GetCourseStudentsResponse } from "@/types/attendance";

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

export async function getCourseStudents(
  courseId: string | number,
): Promise<CourseStudent[]> {
  const response = await api.get<GetCourseStudentsResponse>(
    `/api/courses/${courseId}/students`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data.data;
}
