const StudentAttendanceRecordSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 max-w-2xl animate-pulse">
      {/* Attendance rate card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-slate-100 shrink-0" />

        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3 w-28 rounded bg-slate-100" />
          <div className="h-6 w-40 rounded bg-slate-100" />
          <div className="h-3 w-24 rounded bg-slate-100" />

          <div className="flex items-center gap-2 mt-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-20 rounded-full bg-slate-100" />
            ))}
          </div>
        </div>
      </div>

      {/* Session record */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-28 rounded bg-slate-100" />
          <div className="h-8 w-64 rounded-full bg-slate-100" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-6 py-4 border-b border-slate-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-slate-100" />
                <div className="h-4 w-20 rounded bg-slate-100" />
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAttendanceRecordSkeleton;
