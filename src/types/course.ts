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
  material_file_name: string;
  file: File;
};

export interface SectionItemPayload {
  material_file_name: string;
  file: File[];
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
  content: string | null;
  size: string;
  material_file_type: string;
  material_file_name: string;
  material_file_url: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: number;
  title: string;
  description: string;
  deadline: string;
  weight: number | null;
  attachments: unknown[];
  grade: number | null;
  feedback: string | null;
  graded_at: string | null;
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
