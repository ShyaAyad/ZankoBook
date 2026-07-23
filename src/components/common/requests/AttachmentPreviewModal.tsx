import type { RequestAttachment } from "@/types/academicRequests";
import { Download, FileText, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AttachmentPreviewModalProps {
  attachments: RequestAttachment[];
  activeAttachment: RequestAttachment;
  onSelect: (attachment: RequestAttachment) => void;
  onClose: () => void;
}

const AttachmentPreviewModal = ({
  attachments,
  activeAttachment,
  onSelect,
  onClose,
}: AttachmentPreviewModalProps) => {
  const { t } = useTranslation();

  const openInNewTab = () => {
    window.open(activeAttachment.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t("requestCard.attachmentPreview", "Attachment preview")}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {activeAttachment.name}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={activeAttachment.url}
              download={activeAttachment.name}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-teal-600"
              aria-label={t("requestCard.download", "Download")}
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label={t("requestCard.close", "Close")}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-8">
          <button
            type="button"
            onClick={openInNewTab}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-teal-600"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-xs underline-offset-2 hover:underline">
              {activeAttachment.name}
            </span>
          </button>
        </div>

        {attachments.length > 1 && (
          <div className="flex gap-2 overflow-x-auto border-t border-gray-100 px-4 py-3">
            {attachments.map((attachment) => (
              <button
                key={attachment.id}
                type="button"
                onClick={() => onSelect(attachment)}
                className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  attachment.id === activeAttachment.id
                    ? "border-teal-600 text-teal-700 bg-teal-50"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                {attachment.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentPreviewModal;
