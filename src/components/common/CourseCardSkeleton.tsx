const CourseCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden animate-pulse">
      <div className="h-2 bg-teal-200" />
      <div className="p-5">
        <div className="h-6 w-24 bg-teal-100 rounded-full mb-4" />
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="flex items-center gap-6">
          <div className="h-4 w-16 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;