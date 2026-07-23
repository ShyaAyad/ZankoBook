import { addAssignment } from "@/api/assignments/sectionSubmissions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { useState } from "react";

const SubmissionModal = ({
  sectionId,
  onClose,
}: {
  sectionId: string | number;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [weight, setWeight] = useState("");
  const [maxMark, setMaxMark] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    mutate: createAssignment,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["addAssignment", sectionId],
    mutationFn: () =>
      addAssignment(sectionId, {
        title,
        description,
        due_at: `${dueDate}T${dueTime}`,
        weight,
        max_mark: maxMark,
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
    if (!title || !description || !dueDate || !dueTime || !weight || !maxMark) {
      setValidationError(
        "Title, description, due date, due time, weight, and max mark are required.",
      );
      return;
    }
    setValidationError(null);
    createAssignment();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Submission</h2>
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
          placeholder="e.g. Assignment 3"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
        />

        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Submit your solution as a PDF"
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400 resize-none"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Due time</label>
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Weight</label>
            <input
              type="number"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 10"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Max mark</label>
            <input
              type="number"
              min="0"
              value={maxMark}
              onChange={(e) => setMaxMark(e.target.value)}
              placeholder="e.g. 100"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-teal-400"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-6 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600">
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
          {isPending ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
};

export default SubmissionModal;
