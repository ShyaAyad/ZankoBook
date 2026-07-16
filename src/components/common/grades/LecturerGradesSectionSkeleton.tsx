import { Skeleton } from "@/components/ui/skeleton";

const COLUMN_COUNT = 6;
const ROW_COUNT = 6;

const LecturerGradesSectionSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-44 rounded" />

        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Gradebook table */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="px-6 py-5">
                <Skeleton className="h-3 w-16 rounded" />
              </th>

              {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
                <th key={i} className="min-w-30 px-4 py-5">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-3 w-12 rounded" />
                  </div>
                </th>
              ))}

              <th className="px-6 py-5">
                <div className="flex justify-center">
                  <Skeleton className="h-3 w-12 rounded" />
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-slate-100 last:border-b-0"
              >
                {/* Student */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-28 rounded" />
                  </div>
                </td>

                {/* Assessment cells */}
                {Array.from({ length: COLUMN_COUNT }).map((_, colIndex) => (
                  <td key={colIndex} className="px-3 py-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-9 w-20 rounded-lg" />
                    </div>
                  </td>
                ))}

                {/* Total */}
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <Skeleton className="h-4 w-8 rounded" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-32 rounded-xl" />
        <Skeleton className="h-12 w-56 rounded-xl" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
    </div>
  );
};

export default LecturerGradesSectionSkeleton;
