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
