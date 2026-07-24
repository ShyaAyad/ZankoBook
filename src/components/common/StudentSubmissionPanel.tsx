import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Trash2, Upload, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  deleteUploadedSubmission,
  getMySubmission,
  uploadSectionSubmission,
} from "@/api/courses/student";

const MAX_TOTAL_SIZE = 9 * 1024 * 1024;

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const parseDueAt = (value: string) => new Date(value.replace(" ", "T"));

interface StudentSubmissionPanelProps {
  submissionId: number;
  dueAt: string;
  compact?: boolean;
}

export default function StudentSubmissionPanel({
  submissionId,
  dueAt,
  compact = false,
}: StudentSubmissionPanelProps) {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const deadlinePassed = Date.now() > parseDueAt(dueAt).getTime();

  const submissionQuery = useQuery({
    queryKey: ["my-submission", submissionId],
    queryFn: () => getMySubmission(submissionId),
  });

  const totalSize = useMemo(
    () => files.reduce((sum, file) => sum + file.size, 0),
    [files],
  );

  const uploadMutation = useMutation({
    mutationFn: () => uploadSectionSubmission(submissionId, { files }),
    onSuccess: async () => {
      setFiles([]);
      setLocalError(null);
      await queryClient.invalidateQueries({
        queryKey: ["my-submission", submissionId],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (studentSubmissionId: number) =>
      deleteUploadedSubmission(studentSubmissionId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["my-submission", submissionId],
      }),
  });

  const addFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = Array.from(event.target.files ?? []);
    event.target.value = "";
    const combined = [...files, ...next];
    const combinedSize = combined.reduce((sum, file) => sum + file.size, 0);
    if (combinedSize > MAX_TOTAL_SIZE) {
      setLocalError("Selected files must not exceed 9 MB in total.");
      return;
    }
    setLocalError(null);
    setFiles(combined);
  };

  const submit = () => {
    if (deadlinePassed) return;
    if (!files.length) {
      setLocalError("Select at least one file.");
      return;
    }
    uploadMutation.mutate();
  };

  const error =
    localError ||
    (uploadMutation.error instanceof Error ? uploadMutation.error.message : null) ||
    (deleteMutation.error instanceof Error ? deleteMutation.error.message : null);

  return (
    <div className={compact ? "space-y-4" : "rounded-2xl border border-slate-200 bg-white p-5 space-y-4"}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-slate-900">Your submission</h3>
          <p className="text-xs text-slate-500 mt-1">
            {deadlinePassed ? "The submission deadline has passed." : "Upload up to 9 MB total."}
          </p>
        </div>
        {!deadlinePassed && (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100">
            <Upload size={16} /> Add files
            <input type="file" multiple className="hidden" onChange={addFiles} />
          </label>
        )}
      </div>

      {submissionQuery.isLoading ? (
        <p className="text-sm text-slate-500">Loading uploaded files…</p>
      ) : (submissionQuery.data ?? []).length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">No files submitted.</p>
      ) : (
        <div className="space-y-2">
          {(submissionQuery.data ?? []).map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 text-teal-700">
                <FileText size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.file_name}</p>
                <p className="text-xs text-slate-500">{formatSize(item.file_size)}</p>
              </div>
              <a href={item.file_url} target="_blank" rel="noreferrer" className="p-2 text-slate-500 hover:text-teal-700" aria-label={`Open ${item.file_name}`}>
                <Download size={17} />
              </a>
              {!deadlinePassed && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete ${item.file_name}?`)) deleteMutation.mutate(item.id);
                  }}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Delete ${item.file_name}`}
                >
                  <Trash2 size={17} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && !deadlinePassed && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Files to upload ({files.length})</span>
            <span>{formatSize(totalSize)} / 9 MB</span>
          </div>
          {files.map((file, index) => (
            <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
              <FileText size={16} className="text-slate-400" />
              <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
              <span className="text-xs text-slate-400">{formatSize(file.size)}</span>
              <button type="button" onClick={() => setFiles((current) => current.filter((_, i) => i !== index))} className="text-slate-400 hover:text-red-600">
                <X size={15} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={submit}
            disabled={uploadMutation.isPending}
            className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
          >
            {uploadMutation.isPending ? "Uploading…" : "Submit files"}
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>}
    </div>
  );
}
