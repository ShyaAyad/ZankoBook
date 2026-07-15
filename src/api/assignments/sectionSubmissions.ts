import api from "@/lib/axios";
import type {
  CourseAssignmentPayload,
  CourseAssignmentResponse,
  GradeAndFeedbackPayload,
} from "@/types/course";

export async function addAssignment(
  sectionId: string | number,
  payload: CourseAssignmentPayload,
): Promise<CourseAssignmentResponse> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("deadline", payload.deadline);
  payload.files.forEach((file) => {
    formData.append("files[]", file);
  });

  const response = await api.post(
    `api/moodle/course-sections/${sectionId}/submissions`,
    formData,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function viewAssignments(
  sectionId: string | null,
): Promise<CourseAssignmentResponse[]> {
  const response = await api.get(
    `api/moodle/course-sections/${sectionId}/submissions`,
  );
  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function deleteAssignment(sectionSubmissionId: string | null) {
  const response = await api.delete(
    `/api/moodle/section-submissions/${sectionSubmissionId}`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function updateAssignment(
  sectionSubmissionId: string | null,
  payload: CourseAssignmentPayload,
) {
  const response = await api.put(
    `/api/moodle/section-submissions/${sectionSubmissionId}`,
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
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