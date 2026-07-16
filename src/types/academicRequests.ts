import type { ApiResponse } from "./api";

export type RequestStatus = "approved" | "pending" | "rejected";

export interface AcademicRequestPayload {
  type: string;
  subject: string;
  description: string;
  department_id?: number;
  files?: File[];
}

export interface Attachment {
  id: number;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
}

export interface AcademicRequest {
  id: number;
  type: string;
  status: RequestStatus;
  subject: string;
  description: string;
  user: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
  attachments: Attachment[];
}

export type SendAcademicRequestResponse = ApiResponse<AcademicRequest>;
export type GetAcademicRequestsResponse = ApiResponse<AcademicRequest[]>;
