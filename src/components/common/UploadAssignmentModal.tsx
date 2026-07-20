import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X, File as FileIcon } from "lucide-react";
import { useState } from "react";
import { uploadSectionSubmission } from "@/api/courses/student";
import type { StudentSubmissionPayload } from "@/types/submission";

const UploadAssignmentModal = ({
  submissionId,
  onClose,
}: {
  submissionId: number;
  onClose: () => void;
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    mutate: uploadSubmission,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["uploadStudentSubmission", submissionId],
    mutationFn: (payload: StudentSubmissionPayload) =>
      uploadSectionSubmission(submissionId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-submission", submissionId],
      });
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (files.length === 0) {
      setValidationError("Attach at least one file to submit.");
      return;
    }
    setValidationError(null);
    uploadSubmission({ files: files });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Upload submission</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-3 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600 shrink-0">
            <Upload size={16} />
          </div>
          <span className="text-sm text-gray-500">
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
              : "Click to attach a file"}
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {files.length > 0 && (
          <ul className="mb-4 space-y-1.5">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="flex items-center justify-between gap-2 text-sm bg-gray-50 rounded-lg px-3 py-2"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <FileIcon size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </span>
                <button
                  onClick={() => removeFile(i)}
                  className="text-gray-400 hover:text-red-500 shrink-0"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {(validationError || error) && (
          <p className="text-sm text-red-500 mb-4">
            {validationError ||
              (error instanceof Error
                ? error.message
                : "Something went wrong.")}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 transition-colors text-white font-semibold text-sm py-3 rounded-xl"
        >
          {isPending ? "Uploading..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default UploadAssignmentModal;
