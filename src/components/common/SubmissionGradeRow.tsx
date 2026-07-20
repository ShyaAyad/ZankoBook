import { Eye, CheckCircle2 } from "lucide-react";
import type { StudentSubmission } from "@/types/submission";

export interface GradeDraft {
  mark: string;
  feedback: string;
}

interface SubmissionGradeRowProps {
  studentId: number;
  studentName: string;
  attachments: StudentSubmission[];
  submittedAt: string;
  maxScore: string | number;
  existingMark: { mark: number; feedback: string | null } | null;
  draft: GradeDraft;
  onDraftChange: (field: "mark" | "feedback", value: string) => void;
  onPreview: () => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

const SubmissionGradeRow = ({
  studentId: _studentId,
  studentName,
  attachments,
  submittedAt,
  maxScore,
  existingMark,
  draft,
  onDraftChange,
  onPreview,
}: SubmissionGradeRowProps) => {
  const fileLabel =
    attachments.length === 1
      ? attachments[0].file_name
      : `${attachments.length} files`;

  return (
    <div className="border border-gray-100 rounded-xl px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-600">
            {getInitials(studentName)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm truncate">{studentName}</p>
              {existingMark ? (
                <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-teal-50 text-teal-600">
                  <CheckCircle2 size={12} />
                  Graded
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 bg-green-50 text-green-600">
                  On time
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 truncate">
              {fileLabel} · {formatDate(submittedAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onPreview}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 transition-colors"
            aria-label={`Preview ${studentName}'s submission`}
          >
            <Eye size={16} />
          </button>

          {existingMark ? (
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                {existingMark.mark}
                <span className="text-gray-400 font-medium">/{maxScore}</span>
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={maxScore}
                value={draft.mark}
                onChange={(e) => onDraftChange("mark", e.target.value)}
                placeholder="—"
                className="w-16 text-center border border-gray-200 rounded-lg py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <span className="text-sm text-gray-400">/{maxScore}</span>
            </div>
          )}
        </div>
      </div>

      {existingMark?.feedback && (
        <p className="text-xs text-gray-400 mt-2 ml-[52px]">
          Feedback: {existingMark.feedback}
        </p>
      )}

      {!existingMark && (
        <input
          type="text"
          value={draft.feedback}
          onChange={(e) => onDraftChange("feedback", e.target.value)}
          placeholder="Feedback (optional)"
          className="mt-2 ml-[52px] w-[calc(100%-52px)] border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      )}
    </div>
  );
};

export default SubmissionGradeRow;
