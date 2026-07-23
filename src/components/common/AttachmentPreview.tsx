import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { X, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/files";

interface AttachmentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

const AttachmentPreview = ({ files, onRemove }: AttachmentPreviewProps) => {
  const { t } = useTranslation();

  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (files.length === 0) return null;

  return (
    <ul className="mt-3 space-y-2">
      {files.map((file, index) => {
        const url = previewUrls[index];

        return (
          <li
            key={`${file.name}-${index}`}
            className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2"
          >
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-gray-400" />
              <button
                type="button"
                onClick={() =>
                  window.open(url, "_blank", "noopener,noreferrer")
                }
                className="truncate text-sm text-gray-700 underline-offset-2 hover:text-teal-600 hover:underline"
              >
                {file.name}
              </button>
              <span className="shrink-0 text-xs text-gray-400">
                {formatFileSize(file.size)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(index)}
              aria-label={t("Remove attachment")}
              className="shrink-0 text-gray-400 transition-colors hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default AttachmentPreview;
