import { addSectionItem } from "@/api/sectionItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Upload,
  X,
  FileText,
  FileVideo,
  File as FileIcon,
  Link2,
  StickyNote,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface MaterialModalProps {
  sectionId: string | number;
  courseId: string | number;
  onClose: () => void;
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif"];
const VIDEO_EXTENSIONS = ["mp4", "mov", "avi"];

const getExtension = (filename: string) =>
  filename.split(".").pop()?.toLowerCase() ?? "";

const FileTypeIcon = ({ extension }: { extension: string }) => {
  if (VIDEO_EXTENSIONS.includes(extension)) return <FileVideo size={22} />;
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"].includes(extension))
    return <FileText size={22} />;
  return <FileIcon size={22} />;
};

type InputType = "material" | "link" | "note";

const TABS: { type: InputType; label: string; icon: typeof Upload }[] = [
  { type: "material", label: "Material", icon: Upload },
  { type: "link", label: "Link", icon: Link2 },
  { type: "note", label: "Note", icon: StickyNote },
];

const MaterialModal = ({ sectionId, onClose }: MaterialModalProps) => {
  const [inputType, setInputType] = useState<InputType>("material");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  // file mode
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {
    mutate: createItem,
    isPending,
    error,
  } = useMutation({
    mutationKey: ["addSectionItem", sectionId],
    mutationFn: () => {
      if (inputType === "material") {
        return addSectionItem(sectionId, {
          title,
          description,
          file: file as File,
        });
      }
      if (inputType === "link") {
        return addSectionItem(sectionId, { title, url });
      }
      // note
      return addSectionItem(sectionId, { title, description });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
      onClose();
    },
  });

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const extension = getExtension(file.name);
    if (IMAGE_EXTENSIONS.includes(extension)) {
      const objUrl = URL.createObjectURL(file);
      setPreviewUrl(objUrl);
      return () => URL.revokeObjectURL(objUrl);
    }
    setPreviewUrl(null);
  }, [file]);

  const handleTabChange = (type: InputType) => {
    setInputType(type);
    setTitle("");
    setDescription("");
    setUrl("");
    setFile(null);
    setFileError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;

    if (selected && selected.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        `"${selected.name}" is ${formatBytes(
          selected.size,
        )}, which exceeds the ${formatBytes(MAX_FILE_SIZE_BYTES)} limit.`,
      );
      setFile(null);
      e.target.value = "";
      return;
    }

    setFileError(null);
    setFile(selected);
  };

  const handleSubmit = () => {
    if (!title) {
      setFileError("Title is required.");
      return;
    }
    if (inputType === "material" && (!description || !file)) {
      setFileError("Description and file are required.");
      return;
    }
    if (inputType === "link" && !url) {
      setFileError("URL is required.");
      return;
    }
    if (inputType === "note" && !description) {
      setFileError("Note content is required.");
      return;
    }
    setFileError(null);
    createItem();
  };

  const extension = file ? getExtension(file.name) : "";
  const isImage = IMAGE_EXTENSIONS.includes(extension);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Material</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
          {TABS.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => handleTabChange(type)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-colors",
                inputType === type
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <label className="block text-sm font-semibold mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Lecture 5"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
        />

        {inputType === "material" && (
          <>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of this material"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400 resize-none"
            />

            {file ? (
              <div className="border border-gray-200 rounded-xl p-4 mb-2 flex items-center gap-3">
                {isImage && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0">
                    <FileTypeIcon extension={extension} />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">
                    {extension.toUpperCase()} · {formatBytes(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-xl px-4 py-4 mb-2 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                  <Upload size={16} />
                </div>
                <span className="text-sm text-gray-500">
                  Click to choose a file
                </span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
            <p className="text-xs text-gray-400 mb-4">
              Max file size: {formatBytes(MAX_FILE_SIZE_BYTES)}
            </p>
          </>
        )}

        {inputType === "link" && (
          <>
            <label className="block text-sm font-semibold mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
            />
          </>
        )}

        {inputType === "note" && (
          <>
            <label className="block text-sm font-semibold mb-2">Note</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Write a note for students..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400 resize-none"
            />
          </>
        )}

        {(fileError || error) && (
          <p className="text-sm text-red-500 mb-4">
            {fileError ||
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

export default MaterialModal;
