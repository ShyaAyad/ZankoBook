import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { StudentSubmission } from "@/types/submission";
import type { MarkSubmissionPayload } from "@/types/grades";
import { saveMarks } from "@/api/courses/lecturer";
import useLecturerCourses from "@/hooks/useLecturerCourses";
import useLecturerGradebook from "@/hooks/useLecturerGradeBook";
import SubmissionGradeRow, { type GradeDraft } from "./SubmissionGradeRow";
import AttachmentPreviewModal from "./AttachmentPreviewModal";

interface GradeSubmissionModalProps {
  assessmentId: number;
  attachments: StudentSubmission[];
  maxScore: string | number;
  onClose: () => void;
}

interface GroupedSubmission {
  studentId: number;
  student: {
    id: number;
    name: string;
  };
  attachments: StudentSubmission[];
  submittedAt: string;
}

const groupByStudent = (
  attachments: StudentSubmission[],
): GroupedSubmission[] => {
  const byStudentId = new Map<number, GroupedSubmission>();

  for (const attachment of attachments) {
    const existing = byStudentId.get(attachment.student.id);
    if (existing) {
      existing.attachments.push(attachment);
      if (attachment.created_at > existing.submittedAt) {
        existing.submittedAt = attachment.created_at;
      }
    } else {
      byStudentId.set(attachment.student.id, {
        studentId: attachment.student.id,
        student: attachment.student,
        attachments: [attachment],
        submittedAt: attachment.created_at,
      });
    }
  }

  return Array.from(byStudentId.values());
};

const GradeSubmissionModal = ({
  assessmentId,
  attachments,
  maxScore,
  onClose,
}: GradeSubmissionModalProps) => {
  const { courseId } = useParams<{ courseId: string }>();
  const queryClient = useQueryClient();

  const { data: courses } = useLecturerCourses();
  const currentCourse = courses?.find((c) => c.id === Number(courseId));

  const { data: gradebook } = useLecturerGradebook(Number(courseId));

  const existingMarksMap = useMemo(() => {
    const map = new Map<number, { mark: number; feedback: string | null }>();
    console.log(map);
    if (!gradebook) return map;

    for (const student of gradebook.students) {
      const entry = student.marks.find(
        (m) => m.assessment_id === assessmentId && m.mark !== null,
      );
      if (entry && entry.mark !== null) {
        map.set(student.id, { mark: entry.mark, feedback: entry.feedback });
      }
    }
    return map;
  }, [gradebook, assessmentId]);

  const submissions = useMemo(() => {
    return groupByStudent(attachments).map((s) => ({
      ...s,
      existingMark: existingMarksMap.get(s.studentId) ?? null,
    }));
  }, [attachments, existingMarksMap]);

  const [drafts, setDrafts] = useState<Record<number, GradeDraft>>({});
  const [previewing, setPreviewing] = useState<GroupedSubmission | null>(null);

  const handleDraftChange = (
    studentId: number,
    field: "mark" | "feedback",
    value: string,
  ) => {
    setDrafts((prev) => {
      const current = prev[studentId] ?? { mark: "", feedback: "" };
      if (field === "mark") {
        if (value === "")
          return { ...prev, [studentId]: { ...current, mark: "" } };
        const num = Number(value);
        if (Number.isNaN(num)) return prev;
        const clamped = Math.min(Math.max(num, 0), Number(maxScore));
        return { ...prev, [studentId]: { ...current, mark: String(clamped) } };
      }
      return { ...prev, [studentId]: { ...current, feedback: value } };
    });
  };

  const gradedCount = useMemo(() => {
    const alreadyGraded = submissions.filter((s) => s.existingMark).length;
    const newlyDrafted = Object.entries(drafts).filter(
      ([studentId, draft]) =>
        draft.mark.trim() !== "" && !existingMarksMap.has(Number(studentId)),
    ).length;
    return alreadyGraded + newlyDrafted;
  }, [submissions, drafts, existingMarksMap]);

  const {
    mutate: saveBuldMarks,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["saveBulkMarks", assessmentId],
    mutationFn: (marks: MarkSubmissionPayload[]) =>
      saveMarks(assessmentId, { marks }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lecturer-gradebook", courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
      onClose();
    },
  });

  const handleSaveGrades = () => {
    const marks: MarkSubmissionPayload[] = Object.entries(drafts)
      .filter(
        ([studentId, draft]) =>
          draft.mark.trim() !== "" && !existingMarksMap.has(Number(studentId)),
      )
      .map(([studentId, draft]) => ({
        student_id: Number(studentId),
        mark: Number(draft.mark),
        feedback: draft.feedback.trim() === "" ? null : draft.feedback,
      }));

    if (marks.length === 0) return;

    saveBuldMarks(marks);
  };

  const hasNewGrades = Object.entries(drafts).some(
    ([studentId, draft]) =>
      draft.mark.trim() !== "" && !existingMarksMap.has(Number(studentId)),
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-2xl font-extrabold">Submissions</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Review and grade student submissions (out of {maxScore}).
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-2xl font-extrabold">
              {submissions.length}
              <span className="text-gray-400 text-lg font-bold">
                /{currentCourse?.students_count ?? "—"}
              </span>
            </p>
            <p className="text-sm text-gray-400">Submitted</p>
          </div>
          <div className="bg-teal-50 rounded-xl p-4">
            <p className="text-2xl font-extrabold text-teal-600">
              {gradedCount}
            </p>
            <p className="text-sm text-teal-500">graded</p>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto pr-1 space-y-3 mb-5">
          {submissions.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-6">
              No submissions yet.
            </p>
          )}

          {submissions.map((submission) => (
            <SubmissionGradeRow
              key={submission.studentId}
              studentId={submission.studentId}
              studentName={submission.student.name}
              attachments={submission.attachments}
              submittedAt={submission.submittedAt}
              maxScore={maxScore}
              existingMark={submission.existingMark}
              draft={drafts[submission.studentId] ?? { mark: "", feedback: "" }}
              onDraftChange={(field, value) =>
                handleDraftChange(submission.studentId, field, value)
              }
              onPreview={() => setPreviewing(submission)}
            />
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-500 mb-3">
            {error instanceof Error ? error.message : "Something went wrong."}
          </p>
        )}

        <button
          onClick={handleSaveGrades}
          disabled={isPending || !hasNewGrades}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 transition-colors text-white font-semibold text-sm py-3 rounded-xl"
        >
          {isPending ? "Saving..." : "Save grades"}
        </button>
      </div>

      {previewing && (
        <AttachmentPreviewModal
          studentName={previewing.student.name}
          attachments={previewing.attachments}
          onClose={() => setPreviewing(null)}
        />
      )}
    </div>
  );
};

export default GradeSubmissionModal;
