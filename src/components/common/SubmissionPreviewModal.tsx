import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X, Download, FileText, RefreshCw } from "lucide-react";
import { useState } from "react";
import {
  uploadSectionSubmission,
  deleteUploadedSubmission,
} from "@/api/courses/student";
import type { StudentSubmission } from "@/types/submission";

const SubmissionPreviewModal = ({
  submissionId,
  attachments,
  onClose,
}: {
  submissionId: number;
  attachments: StudentSubmission[];
  onClose: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [replacementFiles, setReplacementFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const active = attachments[activeIndex];

  const {
    mutate: replaceSubmission,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["replaceStudentSubmission", submissionId],
    mutationFn: async () => {
      // Delete every existing file in this submission first — each
      // attachment has its own `id`, distinct from the shared submission_id.
      await Promise.all(
        attachments.map((attachment) =>
          deleteUploadedSubmission(attachment.id),
        ),
      );

      // Then upload the new file(s) as a fresh submission.
      return uploadSectionSubmission(submissionId, {
        files: replacementFiles,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-submission", submissionId],
      });
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
      setReplacementFiles([]);
      onClose();
    },
  });

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplacementFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleReplace = () => {
    if (replacementFiles.length === 0) {
      setValidationError("Choose a file to replace your submission.");
      return;
    }
    setValidationError(null);
    replaceSubmission();
  };

  if (!active) return null;

  const openInNewTab = () => {
    window.open(active.file_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Submission preview"
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {active.file_name}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={active.file_url}
              download={active.file_name}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-teal-600"
              aria-label="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-8">
          <button
            type="button"
            onClick={openInNewTab}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-600"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-xs underline-offset-2 hover:underline">
              {active.file_name}
            </span>
          </button>
        </div>

        {attachments.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-gray-100 px-5 py-3">
            {attachments.map((attachment, i) => (
              <button
                key={attachment.id}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  i === activeIndex
                    ? "border-teal-600 text-teal-700 bg-teal-50"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {attachment.file_name}
              </button>
            ))}
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-4">
          <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-3 mb-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600 shrink-0">
              <Upload size={16} />
            </div>
            <span className="text-sm text-gray-500">
              {replacementFiles.length > 0
                ? `${replacementFiles.length} file${
                    replacementFiles.length > 1 ? "s" : ""
                  } ready to upload`
                : "Choose a new file to replace your submission"}
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleReplaceFileChange}
            />
          </label>

          {(validationError || error) && (
            <p className="text-sm text-red-500 mb-3">
              {validationError ||
                (error instanceof Error
                  ? error.message
                  : "Something went wrong.")}
            </p>
          )}

          <button
            onClick={handleReplace}
            disabled={isPending || replacementFiles.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 disabled:opacity-60 transition-colors text-white font-semibold text-sm py-3 rounded-xl"
          >
            <RefreshCw size={14} />
            {isPending ? "Replacing..." : "Replace submission"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionPreviewModal;
