import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, X } from "lucide-react";
import { useParams } from "react-router-dom";
import type { StudentSubmission } from "@/types/submission";
import useLecturerGradebook from "@/hooks/useLecturerGradeBook";
import { saveStudentGrades } from "@/api/grades";

interface GradeSubmissionModalProps {
  assessmentId: number;
  attachments: StudentSubmission[];
  maxScore: string | number;
  onClose: () => void;
}

export default function GradeSubmissionModal({
  assessmentId,
  attachments,
  maxScore,
  onClose,
}: GradeSubmissionModalProps) {
  const { courseId } = useParams<{ courseId: string }>();
  const numericCourseId = Number(courseId);
  const queryClient = useQueryClient();
  const { data: gradebook, isLoading } = useLecturerGradebook(numericCourseId);
  const [drafts, setDrafts] = useState<Record<number, string>>({});

  const filesByStudent = useMemo(() => {
    const map = new Map<number, StudentSubmission[]>();
    for (const file of attachments) {
      const current = map.get(file.student.id) ?? [];
      current.push(file);
      map.set(file.student.id, current);
    }
    return map;
  }, [attachments]);

  const rows = useMemo(() => {
    if (!gradebook) return [];
    return gradebook.students.map((student) => {
      const existing = student.marks.find((mark) => mark.assessment_id === assessmentId);
      return {
        student,
        files: filesByStudent.get(student.id) ?? [],
        initialMark: existing?.mark ?? 0,
      };
    });
  }, [gradebook, assessmentId, filesByStudent]);

  const mutation = useMutation({
    mutationFn: () =>
      saveStudentGrades({
        courseId: numericCourseId,
        payload: {
          academic_year_id: 1,
          marks: rows.map((row) => ({
            assessment_id: assessmentId,
            student_id: row.student.id,
            mark: Number(drafts[row.student.id] ?? row.initialMark),
            feedback: null,
            status: "valid" as const,
          })),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["lecturer-gradebook", numericCourseId],
      });
      onClose();
    },
  });

  const max = Number(maxScore);
  const updateMark = (studentId: number, value: string) => {
    if (value === "") {
      setDrafts((current) => ({ ...current, [studentId]: "" }));
      return;
    }
    const number = Number(value);
    if (Number.isNaN(number)) return;
    setDrafts((current) => ({
      ...current,
      [studentId]: String(Math.min(Math.max(number, 0), max)),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold">Student submissions</h2>
            <p className="mt-1 text-sm text-gray-500">Review files and grade every student from 0 to {maxScore}.</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg bg-gray-100 hover:bg-gray-200" aria-label="Close">
            <X size={17} />
          </button>
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-sm text-gray-500">Loading students…</p>
        ) : (
          <div className="max-h-[60vh] overflow-auto rounded-xl border border-gray-200">
            <table className="min-w-full border-collapse text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row.student.id} className="align-top">
                    <td className="px-4 py-4 font-semibold text-gray-900">{row.student.name}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={max}
                          step="0.01"
                          value={drafts[row.student.id] ?? String(row.initialMark)}
                          onChange={(event) => updateMark(row.student.id, event.target.value)}
                          className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-center focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                        />
                        <span className="text-gray-400">/ {maxScore}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {row.files.length === 0 ? (
                        <span className="text-gray-400">No submission</span>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {row.files.map((file, index) => (
                            <a
                              key={file.id}
                              href={file.file_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex max-w-xs items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 font-medium text-teal-700 hover:bg-teal-100"
                              title={file.file_name}
                            >
                              <FileText size={15} />
                              <span className="max-w-48 truncate">File {index + 1}: {file.file_name}</span>
                              <Download size={14} />
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {mutation.error && (
          <p className="mt-4 whitespace-pre-line text-sm text-red-600">
            {mutation.error instanceof Error ? mutation.error.message : "Could not save grades."}
          </p>
        )}

        <button
          type="button"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending || isLoading || rows.length === 0}
          className="mt-5 w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
        >
          {mutation.isPending ? "Saving grades…" : "Save grades"}
        </button>
      </div>
    </div>
  );
}
