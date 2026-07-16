import { useState } from "react";
import { X, Upload } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseAssignmentResponse } from "@/types/course";
import { updateAssignment } from "@/api/assignments/sectionSubmissions";

const EditAssignmentModal = ({
  assignment,
  onClose,
}: {
  assignment: CourseAssignmentResponse;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState(assignment.title);
  const [description, setDescription] = useState(assignment.description);
  const [deadline, setDeadline] = useState(assignment.deadline.split("T")[0]);
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const {
    mutate: editAssignment,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["editAssignment", assignment.id],
    mutationFn: () =>
      updateAssignment(String(assignment.id), {
        title,
        description,
        deadline,
        files,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleSubmit = () => {
    if (!title || !description || !deadline) return;
    editAssignment();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit assignment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <label className="block text-sm font-semibold mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
        />

        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400 resize-none"
        />

        <label className="block text-sm font-semibold mb-2">Due date</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
        />

        <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-2 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600">
            <Upload size={16} />
          </div>
          <span className="text-sm text-gray-500">
            {files.length > 0
              ? `${files.length} new file${files.length > 1 ? "s" : ""} selected`
              : "Click to replace attachments (optional)"}
          </span>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {assignment.attachments.length > 0 && files.length === 0 && (
          <p className="text-xs text-gray-400 mb-4">
            Current: {assignment.attachments.map((a) => a.file_name).join(", ")}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-500 mb-4">
            {error instanceof Error ? error.message : "Something went wrong."}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 transition-colors text-white font-semibold text-sm py-3 rounded-xl mt-2"
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EditAssignmentModal;
