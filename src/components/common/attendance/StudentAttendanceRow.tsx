import { cn } from "@/lib/utils";
import type { AttendanceStatus, CourseStudent } from "@/types/attendance";

interface StudentAttendanceRowProps {
  student: CourseStudent;
  status?: AttendanceStatus;
  onStatusChange: (studentId: number, status: AttendanceStatus) => void;
  disabled?: boolean;
}

const STATUS_OPTIONS: { key: AttendanceStatus; label: string }[] = [
  { key: "Present", label: "P" },
  { key: "Absent", label: "A" },
  { key: "Late", label: "L" },
  { key: "Excused Absence", label: "E" },
];

const STATUS_STYLES: Record<AttendanceStatus, string> = {
  Present: "bg-teal-600 text-white border-teal-600",
  Absent: "bg-red-500 text-white border-red-500",
  Late: "bg-amber-500 text-white border-amber-500",
  "Excused Absence": "bg-slate-400 text-white border-slate-400",
};

const StudentAttendanceRow = ({
  student,
  status,
  onStatusChange,
  disabled,
}: StudentAttendanceRowProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 last:border-b-0">
      <span className="font-semibold text-slate-800 text-sm">
        {student.user.name}
      </span>

      <div className="flex gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const isActive = status === opt.key;
          return (
            <div
              key={opt.key}
              title={disabled ? "Please select a week first." : undefined}
              className="inline-block"
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onStatusChange(student.id, opt.key)}
                className={cn(
                  "w-9 h-9 rounded-lg border text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                  isActive
                    ? STATUS_STYLES[opt.key]
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50",
                )}
              >
                {opt.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAttendanceRow;
