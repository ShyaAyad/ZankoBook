import type { ApiResponse } from "./api";

export interface GradeCourse {
  id: number;
  name: string;
  code: string;
}

export interface CourseAssessment {
  assessment_id: number;
  title: string;
  type: string;
  max_mark: number;
  weight: number;
  mark_id: number | null;
  mark: number | null;
  status: string | null;
  feedback: string | null;
  graded_at: string | null;
}

export interface CourseMarks {
  course: GradeCourse;
  assessments: CourseAssessment[];
}

export type GetCourseMarksResponse = ApiResponse<CourseMarks>;
