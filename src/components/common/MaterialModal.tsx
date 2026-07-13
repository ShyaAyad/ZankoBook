import { addSectionItem } from "@/api/sectionItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, X, FileText, FileVideo, File as FileIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface SectionCardProps {
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
  if (VIDEO_EXTENSIONS.includes(extension)) {
    return <FileVideo size={22} />;
  }
  if (["doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf"].includes(extension)) {
    return <FileText size={22} />;
  }
  return <FileIcon size={22} />;
};

const MaterialModal = ({ sectionId, courseId, onClose }: SectionCardProps) => {
  const [materialFileName, setMaterialFileName] = useState("");
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
    mutationFn: () =>
      addSectionItem(sectionId, {
        material_file_name: materialFileName,
        file: file as File,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-sections", courseId],
      });
      onClose();
    },
  });

  // build/revoke an object URL for image previews
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const extension = getExtension(file.name);
    if (IMAGE_EXTENSIONS.includes(extension)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

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

  const handleRemoveFile = () => {
    setFile(null);
    setFileError(null);
  };

  const handleSubmit = () => {
    if (!materialFileName || !file) {
      setFileError("Title and file are required.");
      return;
    }
    createItem();
  };

  const extension = file ? getExtension(file.name) : "";
  const isImage = IMAGE_EXTENSIONS.includes(extension);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Material</h2>
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
          placeholder="e.g. Lecture 5 notes"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-4 outline-none focus:border-teal-400"
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
              onClick={handleRemoveFile}
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