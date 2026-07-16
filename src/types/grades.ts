import type { ApiResponse } from "./api";

/* -------------------------------------------------------------------------- */
/*                                   Shared                                   */
/* -------------------------------------------------------------------------- */

export interface GradeCourse {
  id: number;
  name: string;
  code: string;
}

export type AssessmentType =
  | "quiz"
  | "assignment"
  | "final"
  | "midterm"
  | "project"
  | "activity";

/* -------------------------------------------------------------------------- */
/*                           Student Course Grades                            */
/* -------------------------------------------------------------------------- */

/** A student's mark for a single assessment. */
export interface StudentAssessmentMark {
  assessment_id: number;
  title: string;
  type: AssessmentType;
  max_mark: number;
  weight: number;
  mark_id: number | null;
  mark: number | null;
  status: string | null;
  feedback: string | null;
  graded_at: string | null;
}

/** Student marks grouped by course. */
export interface CourseMarks {
  course: GradeCourse;
  assessments: StudentAssessmentMark[];
}

/* -------------------------------------------------------------------------- */
/*                           Lecturer Gradebook                               */
/* -------------------------------------------------------------------------- */

/** Assessment metadata shown in the lecturer gradebook. */
export interface GradebookAssessment {
  id: number;
  title: string;
  type: AssessmentType;
  max_mark: number;
  weight: number;
}

/** A student's mark entry within the gradebook. */
export interface GradebookStudentMark {
  assessment_id: number;
  mark: number | null;
  status: string | null;
  feedback: string | null;
}

/** A student row in the lecturer gradebook. */
export interface GradebookStudent {
  id: number;
  name: string;
  total_grade: number;
  marks: GradebookStudentMark[];
}

/** Complete gradebook for a course. */
export interface Gradebook {
  assessments: GradebookAssessment[];
  students: GradebookStudent[];
}

/* -------------------------------------------------------------------------- */
/*                          Course Assessment Editing                         */
/* -------------------------------------------------------------------------- */

/** Full course assessment model. */
export interface CourseAssessment {
  assessment_id: number;
  course_id: number;
  teacher_id: number;
  academic_year_id: number;
  title: string;
  type: AssessmentType;
  max_mark: number;
  weight: number;
  due_at: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AssessmentsUIState {
  id?: number; // undefined = new assessment
  tempId: string;

  title: string;
  max_mark: number;
  weight: number;
  type: AssessmentType;

  // State is used to visually dis
  state: "clean" | "new" | "edited" | "deleted";
}

export interface CreateAssessmentPayload {
  title: string;
  weight: number;
  max_mark: number;
}

export interface UpdateAssessmentPayload {
  id: number;
  title?: string;
  weight?: number;
  max_mark?: number;
}

export interface ModifyAssessmentsPayload {
  create: CreateAssessmentPayload[];
  update: UpdateAssessmentPayload[];
  delete: number[];
}

/* -------------------------------------------------------------------------- */
/*                             Gradebook Saving                               */
/* -------------------------------------------------------------------------- */

/** A single mark submission for a student assessment. */
export interface SaveGradebookMarkPayload {
  assessment_id: number;
  student_id: number;
  mark: number | null;
  feedback: string | null;
  status: "valid" | "voided" | "excused" | "absent" | "under_review";
}

/** Payload for saving the entire course gradebook. */
export interface SaveGradebookPayload {
  academic_year_id: number;
  marks: SaveGradebookMarkPayload[];
}

/** Result returned after saving the gradebook. */
export interface SaveGradebookResult {
  saved_marks_count: number;
  recalculated_students_count: number;
}

/* -------------------------------------------------------------------------- */
/*                                 Responses                                  */
/* -------------------------------------------------------------------------- */

export type GetCourseMarksResponse = ApiResponse<CourseMarks>;
export type GetGradebookResponse = ApiResponse<Gradebook>;
export type UpdateCourseAssessmentsResponse = ApiResponse<CourseAssessment[]>;
export type SaveGradebookResponse = ApiResponse<SaveGradebookResult>;
export type ModifyAssessmentsResponse = ApiResponse<CourseAssessment[]>;
