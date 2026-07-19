import type { CourseStudent } from "@/types/attendance";

interface StudentsTableProps {
  students: CourseStudent[];
}

const statusStyles: Record<string, string> = {
  active: "bg-teal-50 text-teal-700",
  inactive: "bg-gray-100 text-gray-600",
  suspended: "bg-red-100 text-red-700",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const StudentsTable = ({ students }: StudentsTableProps) => {
  if (students.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-500">
        No students found.
      </div>
    );
  }

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
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {student.user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {student.user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {student.user.email ?? "No email"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600 font-medium">
                {student.student_number}
              </td>
              <td className="px-4 py-3 text-gray-600">{student.stage}</td>
              <td className="px-4 py-3 text-gray-600">
                {capitalize(student.enrollment_type)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    statusStyles[student.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {capitalize(student.status)}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500">
                {formatDate(student.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;
