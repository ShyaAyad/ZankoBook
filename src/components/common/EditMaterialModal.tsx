import { updateSectionItem } from "@/api/sectionItem";
import type { SectionItem, SectionItemPayload } from "@/types/course";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X } from "lucide-react";
import { useState } from "react";

interface EditMaterialModalProps {
  item: SectionItem;
  onClose: () => void;
}

const EditMaterialModal = ({ item, onClose }: EditMaterialModalProps) => {
  const [materialFileName, setMaterialFileName] = useState(
    item.material_file_name ?? item.title ?? "",
  );
  const [files, setFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const {
    mutate: editItem,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["editSectionItem", item.id],
    mutationFn: (payload: SectionItemPayload) =>
      updateSectionItem(item.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
      onClose();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files ? Array.from(e.target.files) : []);
  };

  const handleSubmit = () => {
    if (!materialFileName) return;
    editItem({ material_file_name: materialFileName, file: files });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Edit material</h2>
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
          value={materialFileName}
          onChange={(e) => setMaterialFileName(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
        />

        <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-6 cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600">
            <Upload size={16} />
          </div>
          <span className="text-sm text-gray-500">
            {files.length > 0
              ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
              : "Click to replace the file (optional)"}
          </span>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

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
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default EditMaterialModal;
