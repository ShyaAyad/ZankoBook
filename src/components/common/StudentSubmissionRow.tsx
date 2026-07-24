import { useState } from "react";
import { CalendarClock, ChevronDown, ChevronUp, ClipboardList, Download, FileText } from "lucide-react";
import type { CourseAssessment, Attachment } from "@/types/course";
import StudentSubmissionPanel from "./StudentSubmissionPanel";

const formatDate = (value: string) =>
  new Date(value.replace(" ", "T")).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

interface StudentSubmissionRowProps {
  submissionId: number;
  assessment: CourseAssessment;
  description?: string;
  attachments?: Attachment[];
  isLecturer: boolean;
  isAllowedToModify: boolean;
  isPrimaryLecturer: boolean;
  grade: () => Promise<void>;
}

export default function StudentSubmissionRow({
  submissionId,
  assessment,
  description,
  attachments = [],
}: StudentSubmissionRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between gap-4">
        <button type="button" onClick={() => setExpanded((value) => !value)} className="flex min-w-0 items-center gap-3 text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <ClipboardList size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{assessment.title}</p>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-orange-600">
              <span className="h-1 w-1 rounded-full bg-current" />
              Due · {formatDate(assessment.due_at)}
            </p>
          </div>
        </button>
        <button type="button" onClick={() => setExpanded((value) => !value)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="ml-14 mt-3 space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          {description && <p className="whitespace-pre-wrap text-sm text-gray-600">{description}</p>}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><CalendarClock size={14} /> Due {formatDate(assessment.due_at)}</span>
            <span>Max mark: {assessment.max_mark}</span>
            <span>Weight: {assessment.weight}</span>
          </div>
          {attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Assignment files</p>
              {attachments.map((attachment) => (
                <a key={attachment.id} href={attachment.file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-teal-700">
                  <FileText size={15} /><span className="min-w-0 flex-1 truncate">{attachment.file_name}</span><Download size={15} />
                </a>
              ))}
            </div>
          )}
          <StudentSubmissionPanel submissionId={submissionId} dueAt={assessment.due_at} compact />
        </div>
      )}
    </div>
  );
}
