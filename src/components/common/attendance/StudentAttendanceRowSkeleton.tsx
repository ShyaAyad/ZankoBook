const StudentAttendanceRowSkeleton = () => {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 last:border-b-0">
      <div className="h-4 w-36 rounded bg-slate-100 animate-pulse" />

      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-lg bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
};

export default StudentAttendanceRowSkeleton;
