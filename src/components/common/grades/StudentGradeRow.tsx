import type { GradebookAssessment, GradebookStudent } from "@/types/grades";

interface StudentGradeRowProps {
  student: GradebookStudent;
  assessments: GradebookAssessment[];
  grades: Record<number, number | null>;
  onGradeChange: (assessmentId: number, value: number | null) => void;
}

const StudentGradeRow = ({
  student,
  assessments,
  grades,
  onGradeChange,
}: StudentGradeRowProps) => {
  const initials = student.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <tr className="border-b border-slate-100 last:border-b-0">
      {/* Student */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
            {initials}
          </div>

          <span className="font-semibold text-slate-800">{student.name}</span>
        </div>
      </td>

      {/* Assessment Marks */}
      {assessments.map((assessment) => {
        return (
          <td key={assessment.id} className="px-3 py-4 text-center">
            <input
              type="number"
              value={grades[assessment.id] ?? ""}
              min={0}
              max={assessment.max_mark}
              placeholder="—"
              onChange={(e) => {
                const value = e.target.value;

                onGradeChange(
                  assessment.id,
                  value === "" ? null : Number(value),
                );
              }}
              className="w-20 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-center text-sm font-semibold text-slate-800 transition-colors placeholder:text-slate-300 hover:border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </td>
        );
      })}

      {/* Total */}
      <td className="px-6 py-4 text-center">
        <span className="font-bold text-lg text-emerald-600">
          {student.total_grade}
        </span>
      </td>
    </tr>
  );
};

export default StudentGradeRow;
