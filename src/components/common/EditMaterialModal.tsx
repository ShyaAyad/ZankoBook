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
  const isLink = !!item.url && !item.material_file_url;
  const isNote = !item.url && !item.material_file_url;
  const isMaterial = !isLink && !isNote;

  const [title, setTitle] = useState(item.title ?? "");
  const [description, setDescription] = useState(item.content ?? "");
  const [url, setUrl] = useState(item.url ?? "");
  const [file, setFile] = useState<File | null>(null);
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
    setFile(e.target.files?.[0] ?? null);
  };

  const handleSubmit = () => {
    if (!title) return;

    const payload: SectionItemPayload = { title };
    if (isLink) payload.url = url;
    if (isNote) payload.description = description;
    if (isMaterial) {
      payload.description = description;
      if (file) payload.file = file;
    }

    editItem(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {isLink ? "Edit link" : isNote ? "Edit note" : "Edit material"}
          </h2>
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

        {isLink && (
          <>
            <label className="block text-sm font-semibold mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
            />
          </>
        )}

        {isNote && (
          <>
            <label className="block text-sm font-semibold mb-2">Note</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400 resize-none"
            />
          </>
        )}

        {isMaterial && (
          <>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400 resize-none"
            />

            <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-6 cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                <Upload size={16} />
              </div>
              <span className="text-sm text-gray-500">
                {file ? file.name : "Click to replace the file (optional)"}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </>
        )}

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
