import type { Attachment } from "./academicRequests";
import type { ApiResponse } from "./api";
import type { User } from "./auth";

export interface Department {
  id: number;
  name: string;
  code: string;
  faculty_id: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: number;
  title: string;
  speciality: string;
  user: User;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  credit_hours: number;
  year_level: number;
  is_active: number;
  students_count: number;
  sections_count: number;
  department_id: number;
  department: Department;
  teachers: Teacher;
  created_at: string;
  updated_at: string;
}

export type CourseSectionPayload = {
  title: string;
};

export type AddSectionItemPayload = {
  title: string;
  description?: string;
  file?: File;
  url?: string;
};

export interface SectionItemPayload {
  title: string;
  description?: string;
  file?: File;
  url?: string;
}

export interface GradeAndFeedbackPayload {
  grade: number;
  feedback: string;
  weight: number;
}

export interface SectionItem {
  id: number;
  section_id: number;
  title: string;
  type: string;
  url: string;
  description: string | null;
  size: string;
  material_file_type: string;
  material_file_url: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  description: string;
  course_assessment: {
    id: number;
    course_id: number;
    teacher_id: number;
    academic_year_id: number;
    title: string;
    max_mark: string;
    weight: string;
    due_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface CourseSection {
  id: number;
  title: string;
  course: {
    id: number;
    name: string;
    code: string;
    credit_hours: number;
    year_level: number;
    is_active: number;
    department_id: number;
    semester: string;
    created_at: string;
    updated_at: string;
  };
  items: SectionItem[];
  submissions: Submission[];
  created_at: string;
  updated_at: string;
}

export interface CourseAssignmentPayload {
  title: string;
  description: string;
  due_at: string;
  weight: string;
  max_mark: string;
  files?: File[];
}

export interface CourseAssignmentResponse {
  id: number;
  title: string;
  description: string;
  due_at: string;
  weight: number | null;
  section: {
    id: number;
    title: string;
  };
  attachments: Attachment[];
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CourseAssessmentResponse {
  id: number | null;
  course_id: number | null;
  academic_year_id: number | null;
  type?: string;
  max_mark: number | null;
  title: string;
  weight: number | null;
  due_at: string;
  teacher_id: number | null;
  is_published?: boolean;
  updated_at: string;
  created_at: string;
}

export interface CourseAssessment {
  id: number;
  course_id: number;
  teacher_id: number;
  academic_year_id: number;
  title: string;
  max_mark: string;
  weight: string;
  due_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Submission {
  id: number;
  description: string;
  course_assessment: CourseAssessment;
  attachments: Attachment[];
  created_at: string;
  updated_at: string;
}

export interface CourseTeacherPivot {
  course_id: number;
  teacher_id: number;
  role: "primary_lecturer" | "assistant" | "guest_lecturer";
  created_at: string;
  updated_at: string;
}

export interface CourseTeacher {
  id: number;
  user_id: number;
  pivot: CourseTeacherPivot;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export type GetCourseTeachersResponse = ApiResponse<{ data: CourseTeacher[] }>;
