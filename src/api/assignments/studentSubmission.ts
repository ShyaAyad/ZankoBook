import api from "@/lib/axios";

export async function submitAssignment(sectionId: string | number) {
  const response = await api.post(
    `api/moodle/section-submissions/${sectionId}/submit`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function viewAssignmentSubmission(sectionId: string | number) {
  const response = await api.get(
    `api/moodle/section-submissions/${sectionId}/my-submission`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function deleteSubmission(sectionId: string | number) {
  const response = await api.delete(`api/moodle/student-submissions/${sectionId}`);

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function downloadAssignmentSubmission() {
  const response = await api.get(`api/moodle/student-submissions/2/download`);

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
