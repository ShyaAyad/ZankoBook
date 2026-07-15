import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import StudentAttendanceRow from "@/components/common/attendance/StudentAttendanceRow";
import AddWeekModal from "@/components/common/attendance/AddWeekModal";
import type {
  AttendanceStatus,
  AttendanceWeek,
  SaveAttendancePayload,
} from "@/types/attendance";
import useLecturerCourse from "@/hooks/useLecturerCourse";
import { useParams } from "react-router-dom";
import {
  getCourseStudents,
  getAttendanceWeeks,
  submitAttendanceRecords,
  getAttendanceRecords,
} from "@/api/attendance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifySuccess, notifyError } from "@/lib/toast";
import WeekCardsSkeleton from "@/components/common/attendance/WeekCardSkeleton";
import AttendanceTableSkeleton from "@/components/common/attendance/AttendanceTableSkeleton";

const LecturerAttendanceSection = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const { data: course } = useLecturerCourse(courseId?.toString());

  const [selectedWeekId, setSelectedWeekId] = useState<number | null>(null);
  const [isAddWeekModalOpen, setIsAddWeekModalOpen] = useState(false);
  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >({});

  const hydratedWeekIdRef = useRef<number | null>(null);

  // Fetch attendance weeks
  const {
    data: weeks = [],
    refetch: refetchWeeks,
    isLoading: isLoadingWeeks,
  } = useQuery({
    queryKey: ["attendance-weeks", courseId],
    queryFn: () => getAttendanceWeeks(Number(courseId)),
  });

  // Fetch students
  const { data: students = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["course-students", courseId],
    queryFn: () => getCourseStudents(Number(courseId)),
  });

  const sortedWeeks = [...weeks].sort((a, b) =>
    a.session_date.localeCompare(b.session_date),
  );

  // Fetch attendance records
  const { data: attendanceRecords = [], isLoading: isLoadingRecords } =
    useQuery({
      queryKey: ["attendance-records", selectedWeekId],
      queryFn: () => getAttendanceRecords(selectedWeekId!),
      enabled: !!selectedWeekId,
    });

  // Save attendance
  const { mutate: saveAttendance, isPending: isSavingAttendance } = useMutation(
    {
      mutationFn: (payload: SaveAttendancePayload) =>
        submitAttendanceRecords(payload, selectedWeekId!),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["attendance-records", selectedWeekId],
        });
        notifySuccess(t("Attendance saved"));
      },
      onError: () => {
        notifyError(t("Couldn't save attendance. Please try again."));
      },
    },
  );

  // Clear local state whenever week changes
  useEffect(() => {
    const clearSheet = () => {
      setAttendance({});
      hydratedWeekIdRef.current = null;
    };

    clearSheet();
  }, [selectedWeekId]);

  // Hydrate local state from server
  useEffect(() => {
    if (!selectedWeekId || isLoadingRecords) return;
    if (hydratedWeekIdRef.current === selectedWeekId) return;

    hydratedWeekIdRef.current = selectedWeekId;

    setAttendance(
      attendanceRecords.reduce(
        (acc, record) => {
          acc[record.student.id] = record.status;
          return acc;
        },
        {} as Record<number, AttendanceStatus>,
      ),
    );
  }, [attendanceRecords, isLoadingRecords, selectedWeekId]);

  function handleWeekCreated(week: AttendanceWeek) {
    refetchWeeks();
    setSelectedWeekId(week.id);
  }

  function handleStatusChange(studentId: number, status: AttendanceStatus) {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  }

  function handleAllPresent() {
    setAttendance(
      Object.fromEntries(
        students.map((student) => [student.id, "Present" as const]),
      ),
    );
  }

  function handleSave() {
    if (!selectedWeekId) return;

    const hasMissingRecords = students.some(
      (student) => !attendance[student.id],
    );

    if (hasMissingRecords) {
      notifyError(t("Please fill in all attendance statuses"));
      return;
    }

    saveAttendance({
      attendance: students.map((student) => ({
        student_id: student.id,
        status: attendance[student.id],
      })),
    });
  }

  const presentCount = Object.values(attendance).filter(
    (status) => status === "Present",
  ).length;

  if (!course) return null;

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {isLoadingWeeks ? (
            <WeekCardsSkeleton />
          ) : (
            sortedWeeks.map((week) => {
              const isActive = week.id === selectedWeekId;

              return (
                <button
                  key={week.id}
                  onClick={() => setSelectedWeekId(week.id)}
                  title={week.session_date}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {week.title}
                </button>
              );
            })
          )}

          <button
            onClick={() => setIsAddWeekModalOpen(true)}
            className="px-5 py-2.5 flex items-center gap-2 bg-teal-50/50 border border-teal-200 border-dashed text-teal-600 rounded-xl font-semibold text-sm hover:bg-teal-50 transition-colors ml-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {t("Add week")}
          </button>
        </div>

        <div className="flex items-center justify-between mb-4 px-2">
          <div className="text-sm font-medium text-slate-500">
            <span className="text-slate-900 font-bold text-base mr-1">
              {presentCount}
            </span>
            /{students.length} {t("present")}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAllPresent}
              disabled={!selectedWeekId}
              className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-bold text-sm hover:bg-teal-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("All present")}
            </button>

            <button
              onClick={handleSave}
              disabled={!selectedWeekId || isSavingAttendance}
              className="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold text-sm hover:bg-teal-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingAttendance ? t("Saving…") : t("Save")}
            </button>
          </div>
        </div>

        {!selectedWeekId && (
          <p className="text-sm text-slate-400 mb-4 px-2">
            {t("Select a week to record attendance.")}
          </p>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-col">
            {isLoadingStudents ? (
              <AttendanceTableSkeleton rows={5} />
            ) : (
              <>
                <div className="flex justify-between px-6 py-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                    {t("Student")}
                  </span>

                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mr-1">
                    {t("Attendance")}
                  </span>
                </div>

                {students.map((student) => (
                  <StudentAttendanceRow
                    key={student.id}
                    student={student}
                    status={attendance[student.id]}
                    onStatusChange={handleStatusChange}
                    disabled={!selectedWeekId}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {isAddWeekModalOpen && (
        <AddWeekModal
          courseId={Number(courseId)}
          onClose={() => setIsAddWeekModalOpen(false)}
          onCreated={handleWeekCreated}
        />
      )}
    </div>
  );
};

export default LecturerAttendanceSection;
