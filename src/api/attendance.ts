import api from "@/lib/axios";
import type {
  CreateAttendanceWeekResponse,
  AttendanceWeek,
  CreateAttendanceWeekPayload,
  GetCourseStudentsResponse,
  CourseStudent,
  GetAttendanceWeeksResponse,
  SaveAttendancePayload,
  GetAttendanceRecordsResponse,
  RecordAttendanceResponse,
  GetMyAttendanceResponse,
  GetMyAttendanceParams,
  StudentPersonalAttendanceRecord,
} from "@/types/attendance";

export async function createAttendanceWeek(
  payload: CreateAttendanceWeekPayload,
): Promise<AttendanceWeek> {
  const response = await api.post<CreateAttendanceWeekResponse>(
    "/api/moodle/attendance-sessions",
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getCourseStudents(courseId: number) {
  const response = await api.get<GetCourseStudentsResponse>(
    `/api/courses/${courseId}/students`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  const students: CourseStudent[] = data.data;

  return students;
}

export async function getAttendanceWeeks(courseId: number) {
  const response = await api.get<GetAttendanceWeeksResponse>(
    "/api/moodle/attendance-sessions",
    {
      params: {
        course_id: courseId,
      },
    },
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getAttendanceRecords(weekId: number) {
  const response = await api.get<GetAttendanceRecordsResponse>(
    `api/moodle/attendance-sessions/${weekId}/attendance`,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function submitAttendanceRecords(
  payload: SaveAttendancePayload,
  weekId: number,
) {
  console.log("Saving attendance record: ", payload, " for week: ", weekId);
  const response = await api.post<RecordAttendanceResponse>(
    `/api/moodle/attendance-sessions/${weekId}/attendance`,
    payload,
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}

export async function getMyAttendance(
  params?: GetMyAttendanceParams,
): Promise<StudentPersonalAttendanceRecord[]> {
  const response = await api.get<GetMyAttendanceResponse>(
    "/api/moodle/my-attendance",
    {
      params,
    },
  );

  const { success, message, data } = response.data;

  if (!success) throw new Error(message);

  return data;
}
