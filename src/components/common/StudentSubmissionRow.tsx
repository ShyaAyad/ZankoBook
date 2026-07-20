import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { getMySubmission } from "@/api/courses/student";
import UploadAssignmentModal from "./UploadAssignmentModal";
import SubmissionPreviewModal from "./SubmissionPreviewModal";
import type { StudentSubmission } from "@/types/submission";
import type { CourseAssessment } from "@/types/course";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

interface StudentSubmissionRowProps {
  submissionId: number;
  assessment: CourseAssessment;
}

const StudentSubmissionRow = ({
  submissionId,
  assessment,
}: StudentSubmissionRowProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: attachments = [] } = useQuery<StudentSubmission[]>({
    queryKey: ["my-submission", submissionId],
    queryFn: () => getMySubmission(submissionId),
  });

  return (
    <div className="flex items-center justify-between py-4 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
          <ClipboardList size={20} />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm truncate">{assessment.title}</p>
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-current" />
            Due · {formatDate(assessment.due_at)}
            {assessment.weight && ` · ${assessment.weight} pts`}
          </p>
        </div>
      </div>

      {attachments.length > 0 ? (
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="bg-teal-50 hover:bg-teal-600 hover:text-white transition-colors text-teal-700 font-semibold text-sm px-5 py-2 rounded-lg shrink-0"
        >
          Preview
        </button>
      ) : (
        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 transition-colors text-white font-semibold text-sm px-5 py-2 rounded-lg shrink-0"
        >
          Upload
        </button>
      )}

      {isUploadOpen && (
        <UploadAssignmentModal
          submissionId={submissionId}
          onClose={() => setIsUploadOpen(false)}
        />
      )}

      {isPreviewOpen && (
        <SubmissionPreviewModal
          submissionId={submissionId}
          attachments={attachments}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentSubmissionRow;
