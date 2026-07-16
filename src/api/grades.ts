import api from "@/lib/axios";
import type {
  GetCourseMarksResponse,
  GetGradebookResponse,
  Gradebook,
  ModifyAssessmentsPayload,
  SaveGradebookResponse,
  SaveGradebookPayload,
  ModifyAssessmentsResponse,
} from "@/types/grades";

// Student grade
export async function getMyGrades(courseId: number) {
  const response = await api.get<GetCourseMarksResponse>(
    `/api/moodle/courses/${courseId}/my-marks`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

// Lecturer's view of grades
export async function getCourseGradebook(courseId: number): Promise<Gradebook> {
  const response = await api.get<GetGradebookResponse>(
    `/api/moodle/courses/${courseId}/gradebook`,
    {
      params: {
        academic_year_id: 1,
      },
    },
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function saveStudentGrades({
  courseId,
  payload,
}: {
  courseId: number;
  payload: SaveGradebookPayload;
}) {
  const response = await api.put<SaveGradebookResponse>(
    `/api/moodle/courses/${courseId}/gradebook/marks`,
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function modifyAssessments({
  courseId,
  payload,
}: {
  courseId: number;
  payload: ModifyAssessmentsPayload;
}) {
  const response = await api.patch<ModifyAssessmentsResponse>(
    `/api/moodle/courses/${courseId}/assessments/sync`,
    {
      academic_year_id: 1,
      ...payload,
    },
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
