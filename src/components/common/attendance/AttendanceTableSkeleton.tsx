import StudentAttendanceRowSkeleton from "./StudentAttendanceRowSkeleton";

interface AttendanceTableSkeletonProps {
  rows?: number;
}

const AttendanceTableSkeleton = ({
  rows = 5,
}: AttendanceTableSkeletonProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex justify-between px-6 py-4 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">
          Student
        </span>
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase mr-1">
          Attendance
        </span>
      </div>

      <div className="flex flex-col">
        {Array.from({ length: rows }).map((_, i) => (
          <StudentAttendanceRowSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default AttendanceTableSkeleton;
