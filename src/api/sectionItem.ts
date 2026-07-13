import api from "@/lib/axios";
import type {
  AddSectionItemPayload,
  GradeAndFeedbackPayload,
  SectionItemPayload,
} from "@/types/course";

// returns : Promise<SectionItem>
export async function addSectionItem(
  sectionId: string | number,
  payload: AddSectionItemPayload,
) {
  const formData = new FormData();
  formData.append("material_file_name", payload.material_file_name);
  formData.append("file", payload.file);

  const response = await api.post(
    `api/moodle/course-sections/${sectionId}/items`,
    formData,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getAllSectionItems(sectionId: string | number) {
  const response = await api.get(
    `api/moodle/course-sections/${sectionId}/items`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getSingleSectionItem(sectionItemId: string | number) {
  const response = await api.get(`api/moodle/section-items/${sectionItemId}`);

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function updateSectionItem(
  sectionItemId: string | number,
  payload: SectionItemPayload,
) {
  const response = await api.put(
    `api/moodle/section-items/${sectionItemId}`,
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function deleteSectionItem(sectionItemId: string | Number) {
  const response = await api.delete(
    `api/moodle/section-items/${sectionItemId}`,
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
