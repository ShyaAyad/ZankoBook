import type { ApiResponse } from "./api";

export interface StudentSubmissionPayload {
  files: File[];
}

export interface StudentSubmission {
  id: number;
  student: {
    id: number;
    name: string;
  };
  submission_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export type GetStudentSubmissionResponse = ApiResponse<StudentSubmission>;
