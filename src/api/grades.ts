import api from "@/lib/axios";
import type { GetCourseMarksResponse } from "@/types/grades";

export async function getMyGrades(courseId: number) {
  const response = await api.get<GetCourseMarksResponse>(
    `/api/moodle/courses/${courseId}/my-marks`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
