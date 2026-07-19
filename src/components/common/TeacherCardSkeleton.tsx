const TeacherCardSkeleton = () => {
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="w-11 h-11 rounded-full bg-gray-200 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-100 rounded w-44" />
      </div>
    </div>
  );
};

export default TeacherCardSkeleton;
