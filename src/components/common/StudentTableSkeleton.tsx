const StudentsTableSkeleton = ({ rows = 6 }: { rows?: number }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="text-left font-semibold text-gray-500 px-4 py-3">
              Student
            </th>
            <th className="text-left font-semibold text-gray-500 px-4 py-3">
              Student no.
            </th>
            <th className="text-left font-semibold text-gray-500 px-4 py-3">
              Stage
            </th>
            <th className="text-left font-semibold text-gray-500 px-4 py-3">
              Enrollment
            </th>
            <th className="text-left font-semibold text-gray-500 px-4 py-3">
              Status
            </th>
            <th className="text-left font-semibold text-gray-500 px-4 py-3">
              Joined
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="border-b border-gray-50 last:border-0 animate-pulse"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="h-3.5 bg-gray-200 rounded w-28" />
                    <div className="h-3 bg-gray-100 rounded w-36" />
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="h-3.5 bg-gray-200 rounded w-16" />
              </td>
              <td className="px-4 py-3">
                <div className="h-3.5 bg-gray-200 rounded w-6" />
              </td>
              <td className="px-4 py-3">
                <div className="h-3.5 bg-gray-200 rounded w-14" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 bg-gray-200 rounded-full w-16" />
              </td>
              <td className="px-4 py-3">
                <div className="h-3.5 bg-gray-200 rounded w-20" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTableSkeleton;
