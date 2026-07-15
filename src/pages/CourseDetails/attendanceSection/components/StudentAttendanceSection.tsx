import { useState } from "react";
import { useTranslation } from "react-i18next";
import StudentAttendanceRing from "@/components/common/attendance/StudentAttendanceRing";
import { CheckCircle2, Clock, XCircle, CalendarX } from "lucide-react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import EmptyState from "@/components/common/EmptyState";
import type {
  AttendanceStatus,
  StudentPersonalAttendanceRecord,
} from "@/types/attendance";
import { getMyAttendance } from "@/api/attendance";
import { useParams } from "react-router-dom";
import useStudentCourse from "@/hooks/useStudentCourse";
import { useQuery } from "@tanstack/react-query";
import StudentAttendanceRecordSkeleton from "@/components/common/attendance/StudentAttendanceRecordSkeleton";
import { useUserStore } from "@/store/userStore";

const STATUS_ICON: Record<AttendanceStatus, typeof CheckCircle2> = {
  Present: CheckCircle2,
  Late: Clock,
  Absent: XCircle,
  "Excused Absence": CalendarX,
};

const STATUS_ICON_COLOR: Record<AttendanceStatus, string> = {
  Present: "text-emerald-500",
  Late: "text-amber-500",
  Absent: "text-red-500",
  "Excused Absence": "text-slate-500",
};

const STATUS_BADGE: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-100 text-emerald-700",
  Late: "bg-amber-100 text-amber-700",
  Absent: "bg-red-100 text-red-700",
  "Excused Absence": "bg-slate-100 text-slate-700",
};

const STATUS_PILL: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-50 text-emerald-700",
  Late: "bg-amber-50 text-amber-700",
  Absent: "bg-red-50 text-red-700",
  "Excused Absence": "bg-slate-50 text-slate-700",
};

type FilterKey = "all" | AttendanceStatus;

const StudentAttendance = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterKey>("all");
  const { courseId } = useParams();
  const { user } = useUserStore();
  const isLecturer = user?.roles[0].name === "lecturer";

  const { data: course } = useStudentCourse(courseId, !isLecturer);

  const { data: sessions = [], isLoading } = useQuery<
    StudentPersonalAttendanceRecord[]
  >({
    queryKey: ["my-attendance", course?.id],
    queryFn: () => getMyAttendance({ course_id: course?.id }),
    enabled: !!course,
  });

  const totalSessions = sessions.length;
  const presentCount = sessions.filter((s) => s.status === "Present").length;
  const lateCount = sessions.filter((s) => s.status === "Late").length;
  const absentCount = sessions.filter((s) => s.status === "Absent").length;
  const excusedCount = sessions.filter(
    (s) => s.status === "Excused Absence",
  ).length;
  const attendanceRate =
    totalSessions === 0
      ? 0
      : Math.round(((presentCount + lateCount) / totalSessions) * 100);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: t("All"), count: totalSessions },
    { key: "Present", label: t("Present"), count: presentCount },
    { key: "Late", label: t("Late"), count: lateCount },
    { key: "Absent", label: t("Absent"), count: absentCount },
    {
      key: "Excused Absence",
      label: t("Excused Absence"),
      count: excusedCount,
    },
  ];
  const filteredSessions =
    filter === "all" ? sessions : sessions.filter((s) => s.status === filter);

  const STATUS_COUNTS: Record<AttendanceStatus, number> = {
    Present: presentCount,
    Late: lateCount,
    Absent: absentCount,
    "Excused Absence": excusedCount,
  };

  if (isLoading) {
    return <StudentAttendanceRecordSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Attendance rate card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-6">
        <StudentAttendanceRing percentage={attendanceRate} />

        <div className="flex flex-col gap-1">
          <span className="text-sm text-slate-400 font-medium">
            {t("Attendance rate")}
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            {course?.name ?? t("Course")}
          </h3>
          <span className="text-sm text-slate-400">
            {t("{{count}} sessions held", { count: totalSessions })}
          </span>

          <div className="flex items-center gap-2 mt-2">
            {(["Present", "Late", "Absent", "Excused Absence"] as const).map(
              (status) => {
                const Icon = STATUS_ICON[status];
                const count = STATUS_COUNTS[status];
                return (
                  <span
                    key={status}
                    className={cn(
                      "flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full",
                      STATUS_PILL[status],
                    )}
                  >
                    <Icon
                      className={cn("w-3.5 h-3.5", STATUS_ICON_COLOR[status])}
                    />
                    <span className="font-extrabold">{count}</span>
                    {t(status)}
                  </span>
                );
              },
            )}
          </div>
        </div>
      </div>

      {/* Session record */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 tracking-wider uppercase">
            <HiOutlineClipboardDocumentList className="w-4 h-4" />
            {t("Session record")}
          </span>

          <div className="flex gap-1 bg-slate-100 rounded-full p-1">
            {filters.map((f) => {
              const isActive = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer",
                    isActive
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-teal-50/50 hover:text-teal-700",
                  )}
                >
                  {f.label} · {f.count}
                </button>
              );
            })}
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <EmptyState
              icon={CalendarX}
              title={t("No sessions found")}
              description={t("No sessions match this filter yet.")}
            />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {filteredSessions.map((session) => {
              const Icon = STATUS_ICON[session.status];
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-6 py-4 border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        STATUS_ICON_COLOR[session.status],
                      )}
                    />
                    <span className="font-semibold text-slate-800">
                      {session.attendance_session.session_date}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold px-3 py-1 rounded-full",
                      STATUS_BADGE[session.status],
                    )}
                  >
                    {t(session.status)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAttendance;
