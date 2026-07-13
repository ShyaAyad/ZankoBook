import { addSection } from "@/api/courseSection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useState } from "react";

interface AddSectionModalProps {
  courseId: string | number;
  onClose: () => void;
}

const AddSectionModal = ({ courseId, onClose }: AddSectionModalProps) => {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const {
    mutate: createSection,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["addSection", courseId],
    mutationFn: (title: string) => addSection(courseId, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!title) return;
    createSection(title);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Add section</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <label className="block text-sm font-semibold mb-2">
          Section title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Week 4 — Trees"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-6 outline-none focus:border-teal-400"
        />

        {error && (
          <p className="text-sm text-red-500 mb-4">
            {error instanceof Error ? error.message : "Something went wrong."}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 transition-colors text-white font-semibold text-sm py-3 rounded-xl"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
};

export default AddSectionModal;
