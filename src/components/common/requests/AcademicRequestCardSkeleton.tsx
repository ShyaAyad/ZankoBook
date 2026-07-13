const AcademicRequestCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-20 rounded-full bg-slate-100 animate-pulse" />
        <div className="h-5 w-16 rounded-full bg-slate-100 animate-pulse" />
      </div>

      <div className="flex flex-col gap-2">
        <div className="h-5 w-3/4 rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
        <div className="h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 rounded bg-slate-100 animate-pulse" />
          <div className="h-4 w-8 rounded bg-slate-100 animate-pulse" />
        </div>
        <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
};

export default AcademicRequestCardSkeleton;
