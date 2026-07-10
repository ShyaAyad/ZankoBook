import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { X, FileText } from "lucide-react";
import { formatFileSize } from "@/lib/files";

type FileKind = "image" | "pdf" | null;

// Some browsers/OSes leave `file.type` empty for certain uploads, so we
// fall back to the extension for PDFs to avoid silently losing preview
// support on those files.
function getFileKind(file: File): FileKind {
  if (file.type.startsWith("image/")) return "image";
  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    return "pdf";
  }
  return null;
}

interface AttachmentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

/**
 * Clicking the name of an image or PDF file opens a lightbox preview.
 * Other file types aren't clickable, since there's nothing to preview inline.
 */
const AttachmentPreview = ({ files, onRemove }: AttachmentPreviewProps) => {
  const { t } = useTranslation();
  const [lightbox, setLightbox] = useState<{
    url: string;
    name: string;
    kind: "image" | "pdf";
  } | null>(null);

  // One object URL per previewable file (image or pdf), regenerated
  // whenever the file list changes. Other file types get `null` and
  // their name isn't clickable.
  const previewUrls = useMemo(
    () =>
      files.map((file) =>
        getFileKind(file) ? URL.createObjectURL(file) : null,
      ),
    [files],
  );

  // Revoke the previous batch of object URLs whenever a new batch is
  // created (or on unmount), so we don't leak memory as files change.
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (files.length === 0) return null;

  return (
    <>
      <ul className="mt-3 space-y-2">
        {files.map((file, index) => {
          const url = previewUrls[index];
          const kind = getFileKind(file);

          return (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-2">
                <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                {url && kind ? (
                  <button
                    type="button"
                    onClick={() => setLightbox({ url, name: file.name, kind })}
                    className="truncate text-sm text-gray-700 underline-offset-2 hover:text-teal-600 hover:underline"
                  >
                    {file.name}
                  </button>
                ) : (
                  <span className="truncate text-sm text-gray-700">
                    {file.name}
                  </span>
                )}
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

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-h-[90vh] w-full overflow-hidden rounded-2xl bg-white shadow-2xl ${
              lightbox.kind === "pdf" ? "max-w-4xl" : "max-w-2xl"
            }`}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label={t("Close")}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>

            {lightbox.kind === "image" ? (
              <img
                src={lightbox.url}
                alt={lightbox.name}
                className="max-h-[80vh] w-full object-contain"
              />
            ) : (
              <iframe
                src={lightbox.url}
                title={lightbox.name}
                className="h-[80vh] w-full"
              />
            )}

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-4 py-2">
              <p className="truncate text-sm text-gray-600">{lightbox.name}</p>
              {lightbox.kind === "pdf" && (
                <a
                  href={lightbox.url}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 text-xs font-medium text-teal-600 hover:underline"
                >
                  {t("Open in new tab")}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttachmentPreview;
