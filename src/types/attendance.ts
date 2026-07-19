import type { Course, Teacher } from "./course";
import type { ApiResponse } from "./api";

export interface CreateAttendanceWeekPayload {
  course_id: number;
  session_date: string; // "YYYY-MM-DD"
  start_at: string; // "YYYY-MM-DD HH:mm:ss"
  end_at: string; // "YYYY-MM-DD HH:mm:ss"
  title: string;
}

export interface AttendanceWeek {
  id: number;
  title: string;
  session_date: string; // "YYYY-MM-DD"
  start_at: string; // "YYYY-MM-DD HH:mm:ss"
  end_at: string; // "YYYY-MM-DD HH:mm:ss"
  course: Course;
  teacher: Teacher;
  created_at: string;
  updated_at: string;
}

export interface CourseStudent {
  id: number;
  enrollment_type: "morning" | "evening" | "parallel";
  stage: number;
  student_number: string;
  status: string;
  user: {
    id: number;
    name: string;
    email: string | null;
  };
  created_at: string;
  updated_at: string;
}

export type AttendanceStatus =
  | "Present"
  | "Absent"
  | "Late"
  | "Excused Absence";

export interface AttendanceRecord {
  id: number;
  attendance_session_id: number;
  student: CourseStudent;
  status: AttendanceStatus;
  note: string | null;
  created_at: string;
  updated_at: string;
}

// Students personal attendance record
export interface StudentPersonalAttendanceRecord extends AttendanceRecord {
  attendance_session: AttendanceWeek;
}

export interface SaveAttendancePayload {
  attendance: {
    student_id: number;
    status: AttendanceStatus;
    note?: string;
  }[];
}

// Parameters for `getMyAttendance`
export interface GetMyAttendanceParams {
  course_id?: number;
  status?: AttendanceStatus;
  per_page?: number;
}

export type CreateAttendanceWeekResponse = ApiResponse<AttendanceWeek>;
export type GetCourseStudentsResponse = ApiResponse<{ data: CourseStudent[] }>;
export type GetAttendanceWeeksResponse = ApiResponse<AttendanceWeek[]>;
export type GetAttendanceRecordsResponse = ApiResponse<AttendanceRecord[]>;
export type RecordAttendanceResponse = ApiResponse<null>;
export type GetMyAttendanceResponse = ApiResponse<
  StudentPersonalAttendanceRecord[]
>;
