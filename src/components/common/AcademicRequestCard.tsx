import { Calendar, Paperclip } from "lucide-react";
import { HiArrowLongRight } from "react-icons/hi2";
import { useTranslation } from "react-i18next";
// import { useMutation } from "@tanstack/react-query";
import type { RequestStatus } from "@/types/academicRequests";

interface RequestCardProps {
  subject: string;
  type: string;
  description: string;
  status: RequestStatus;
  dateIssued: string;
  attachmentCount: number;
  onViewLetter: () => void;
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
  attachmentCount,
  onViewLetter,
}: RequestCardProps) => {
  const { i18n } = useTranslation();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
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

      <div>
        <h3 className="text-lg font-bold text-gray-900">{subject}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(dateIssued, i18n.language)}
          </span>
          <span className="flex items-center gap-1">
            <Paperclip className="w-4 h-4" />
            {attachmentCount}
          </span>
        </div>
        <button
          onClick={onViewLetter}
          className="flex items-center gap-1 text-teal-600 font-semibold hover:text-teal-700"
        >
          <span>
            <HiArrowLongRight />
          </span>{" "}
          letter
        </button>
      </div>
    </div>
  );
};

export default RequestCard;
