import { useState } from "react";
import { Calendar, Paperclip } from "lucide-react";
import { useTranslation } from "react-i18next";
import type {
  RequestAttachment,
  RequestStatus,
} from "@/types/academicRequests";
import AttachmentPreviewModal from "./AttachmentPreviewModal";

interface RequestCardProps {
  subject: string;
  type: string;
  description: string;
  status: RequestStatus;
  dateIssued: string;
  attachments: RequestAttachment[];
}

const statusStyles: Record<RequestStatus, string> = {
  approved: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-700",
  rejected: "bg-red-100 text-red-700",
};

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString; // fall back to raw value rather than "Invalid Date"

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const RequestCard = ({
  type,
  status,
  subject,
  description,
  dateIssued,
  attachments,
}: RequestCardProps) => {
  const { t, i18n } = useTranslation();
  const [previewAttachment, setPreviewAttachment] =
    useState<RequestAttachment | null>(null);

  const hasAttachments = attachments.length > 0;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {type}
          </span>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{subject}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(dateIssued, i18n.language)}
            </span>
            <button
              type="button"
              disabled={!hasAttachments}
              onClick={() =>
                hasAttachments && setPreviewAttachment(attachments[0])
              }
              className={`flex items-center gap-1 rounded-md px-1 -mx-1 transition-colors ${
                hasAttachments
                  ? "hover:bg-gray-50 hover:text-teal-600 cursor-pointer"
                  : "cursor-default opacity-60"
              }`}
              aria-label={
                hasAttachments
                  ? t("requestCard.viewAttachments", "View attachments")
                  : t("requestCard.noAttachments", "No attachments")
              }
            >
              <Paperclip className="w-4 h-4" />
              {attachments.length}
            </button>
          </div>
        </div>
      </div>

      {previewAttachment && (
        <AttachmentPreviewModal
          attachments={attachments}
          activeAttachment={previewAttachment}
          onSelect={setPreviewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </>
  );
};

export default RequestCard;
