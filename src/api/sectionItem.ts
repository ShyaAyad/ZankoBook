import api from "@/lib/axios";
import type {
  AddSectionItemPayload,
  SectionItem,
  SectionItemPayload,
} from "@/types/course";

export async function addSectionItem(
  sectionId: string | number,
  payload: AddSectionItemPayload,
): Promise<SectionItem> {
  const formData = new FormData();

  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.url) formData.append("url", payload.url);
  if (payload.file) formData.append("file", payload.file);

  const response = await api.post(
    `api/moodle/course-sections/${sectionId}/items`,
    formData,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getAllSectionItems(
  sectionId: string | number,
): Promise<SectionItem> {
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
): Promise<SectionItem> {
  const response = await api.put(
    `api/moodle/section-items/${sectionItemId}`,
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function deleteSectionItem(sectionItemId: string | number) {
  const response = await api.delete(
    `api/moodle/section-items/${sectionItemId}`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
