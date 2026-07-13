import StudentGradeCardSkeleton from "@/components/common/grades/StudentGradeCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const StudentGradesSectionSkeleton = () => {
  return (
    <div className="max-w-3xl space-y-5">
      {/* Summary card */}
      <div className="rounded-3xl bg-slate-100 p-7">
        <Skeleton className="h-3 w-20 rounded bg-slate-200" />

        <div className="mt-3 flex items-end gap-2">
          <Skeleton className="h-14 w-20 rounded bg-slate-200" />
          <Skeleton className="mb-2 h-6 w-6 rounded bg-slate-200" />
        </div>

        <Skeleton className="mt-3 h-5 w-24 rounded bg-slate-200" />
      </div>

      {/* Assessment cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StudentGradeCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default StudentGradesSectionSkeleton;
