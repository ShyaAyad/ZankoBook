import { useState } from "react";
import { X, Download, FileText } from "lucide-react";
import type { StudentSubmission } from "@/types/submission";

interface AttachmentPreviewModalProps {
  studentName: string;
  attachments: StudentSubmission[];
  onClose: () => void;
}

const AttachmentPreviewModal = ({
  studentName,
  attachments,
  onClose,
}: AttachmentPreviewModalProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = attachments[activeIndex];
  const isImage = active?.file_type?.startsWith("image/");
  const isPdf = active?.file_type === "application/pdf";

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${studentName}'s submission`}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {studentName}
            </p>
            <p className="text-xs text-gray-400 truncate">{active.file_name}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={active.file_url}
              download={active.file_name}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-teal-600"
              aria-label="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4">
          {isImage && (
            <img
              src={active.file_url}
              alt={active.file_name}
              className="max-w-full max-h-[55vh] object-contain rounded-md"
            />
          )}
          {isPdf && (
            <iframe
              src={active.file_url}
              title={active.file_name}
              className="w-full h-[55vh] rounded-md bg-white"
            />
          )}
          {!isImage && !isPdf && (
            <div className="flex flex-col items-center gap-3 text-gray-500 py-10">
              <FileText className="w-10 h-10" />
              <p className="text-sm">
                No preview available for this file type.
              </p>
            </div>
          )}
        </div>

        {attachments.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-gray-100 px-5 py-3">
            {attachments.map((attachment, i) => (
              <button
                key={attachment.id}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  i === activeIndex
                    ? "border-teal-600 text-teal-700 bg-teal-50"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {attachment.file_name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentPreviewModal;
