import {
  addAssignment,
  deleteAssignmentAttachment,
  updateAssignment,
} from "@/api/assignments/sectionSubmissions";
import type { Submission } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Trash2, Upload, X } from "lucide-react";
import { useMemo, useState } from "react";

const MAX_TOTAL_BYTES = 9 * 1024 * 1024;

const parseDueAt = (value?: string) => {
  if (!value) return { date: "", time: "" };
  const [date, rawTime = ""] = value.replace("T", " ").split(" ");
  return { date, time: rawTime.slice(0, 5) };
};

const fileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const SubmissionModal = ({
  sectionId,
  assignment,
  onClose,
}: {
  sectionId: string | number;
  assignment?: Submission | null;
  onClose: () => void;
}) => {
  const initialDue = parseDueAt(assignment?.course_assessment.due_at);
  const [title, setTitle] = useState(assignment?.course_assessment.title ?? "");
  const [description, setDescription] = useState(assignment?.description ?? "");
  const [dueDate, setDueDate] = useState(initialDue.date);
  const [dueTime, setDueTime] = useState(initialDue.time);
  const [weight, setWeight] = useState(assignment?.course_assessment.weight ?? "");
  const [maxMark, setMaxMark] = useState(assignment?.course_assessment.max_mark ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [removedAttachmentIds, setRemovedAttachmentIds] = useState<number[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const isEditing = Boolean(assignment);

  const visibleAttachments = useMemo(
    () =>
      (assignment?.attachments ?? []).filter(
        (attachment) => !removedAttachmentIds.includes(attachment.id),
      ),
    [assignment?.attachments, removedAttachmentIds],
  );

  const totalSelectedSize = files.reduce((sum, file) => sum + file.size, 0);

  const mutation = useMutation({
    mutationKey: [isEditing ? "updateAssignment" : "addAssignment", assignment?.id ?? sectionId],
    mutationFn: async () => {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        due_at: `${dueDate} ${dueTime}:00`,
        weight,
        max_mark: maxMark,
        files,
      };

      if (!assignment) return addAssignment(sectionId, payload);

      const updated = await updateAssignment(assignment.id, payload);
      await Promise.all(
        removedAttachmentIds.map((attachmentId) =>
          deleteAssignmentAttachment(attachmentId),
        ),
      );
      return updated;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["course-sections"] }),
        queryClient.invalidateQueries({ queryKey: ["assignments", sectionId] }),
        assignment
          ? queryClient.invalidateQueries({ queryKey: ["assignment", assignment.id] })
          : Promise.resolve(),
      ]);
      onClose();
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    const next = [...files, ...incoming];
    const nextSize = next.reduce((sum, file) => sum + file.size, 0);
    if (nextSize > MAX_TOTAL_BYTES) {
      setValidationError("The total size of selected files must not exceed 9 MB.");
      event.target.value = "";
      return;
    }
    setValidationError(null);
    setFiles(next);
    event.target.value = "";
  };

  const handleSubmit = () => {
    if (!title.trim() || !dueDate || !dueTime || weight === "" || maxMark === "") {
      setValidationError("Title, due date, due time, weight, and max mark are required.");
      return;
    }
    if (totalSelectedSize > MAX_TOTAL_BYTES) {
      setValidationError("The total size of selected files must not exceed 9 MB.");
      return;
    }
    setValidationError(null);
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{isEditing ? "Edit submission" : "Submission"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>

        <label className="block text-sm font-semibold mb-2">Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Assignment 3" className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400" />

        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. Submit your solution as a PDF" rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400 resize-none" />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Due date *</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Due time *</label>
            <input type="time" step="60" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Weight *</label>
            <input type="number" min="0" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 10" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Max mark *</label>
            <input type="number" min="0" value={maxMark} onChange={(e) => setMaxMark(e.target.value)} placeholder="e.g. 100" className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400" />
          </div>
        </div>

        {isEditing && (
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">Current attachments</p>
            {visibleAttachments.length ? (
              <div className="space-y-2">
                {visibleAttachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2">
                    <FileText size={16} className="text-teal-600 shrink-0" />
                    <a href={attachment.file_url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-sm font-medium text-gray-700 hover:text-teal-600">
                      {attachment.file_name}
                    </a>
                    <button type="button" onClick={() => setRemovedAttachmentIds((ids) => [...ids, attachment.id])} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600" aria-label="Remove attachment">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No current attachments.</p>
            )}
          </div>
        )}

        <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600"><Upload size={16} /></div>
          <span className="text-sm text-gray-500">{files.length ? "Add more files" : "Click to attach files"}</span>
          <input type="file" multiple className="hidden" onChange={handleFileChange} />
        </label>
        <p className="text-xs text-gray-400 mt-2 mb-3">Maximum total size: 9 MB</p>

        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
                <FileText size={16} className="text-gray-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-400">{fileSize(file.size)}</p>
                </div>
                <button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600">
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        )}

        {(validationError || mutation.error) && (
          <p className="text-sm text-red-500 whitespace-pre-line mb-4">{validationError || (mutation.error instanceof Error ? mutation.error.message : "Something went wrong.")}</p>
        )}

        <button onClick={handleSubmit} disabled={mutation.isPending} className="w-full bg-teal-500 hover:bg-teal-600 disabled:opacity-60 transition-colors text-white font-semibold text-sm py-3 rounded-xl">
          {mutation.isPending ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default SubmissionModal;
