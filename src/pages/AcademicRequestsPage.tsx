import { useState } from "react";
import { FileText, Plus } from "lucide-react";
import RequestCard from "@/components/common/requests/AcademicRequestCard";
import AcademicRequestModal from "@/components/common/requests/AcademicRequestModal";
import { getAcademicRequests } from "@/api/academicRequests";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "@/components/common/EmptyState";
import AcademicRequestCardSkeleton from "@/components/common/requests/AcademicRequestCardSkeleton";
import { useTranslation } from "react-i18next";

const AcademicRequestsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["academic-requests"],
    queryFn: getAcademicRequests,
  });

  const hasRequests = (requests?.length ?? 0) > 0;

  return (
    <div className="p-8 mx-[20%]">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t("Requests")}</h1>
          <p className="text-gray-500 mt-1">
            {t("Requests are forwarded to your department in e-Zanko")}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          {t("New request")}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <AcademicRequestCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasRequests ? (
        <EmptyState
          icon={FileText}
          title="No requests yet"
          description="Requests you submit will be forwarded to your department in e-Zanko and appear here."
          action={{
            label: "New request",
            onClick: () => setIsModalOpen(true),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests?.map((request) => (
            <RequestCard
              key={request.id}
              type={request.type}
              status={request.status}
              subject={request.subject}
              description={request.description}
              dateIssued={request.created_at}
              attachments={request.attachments.map((a) => ({
                id: String(a.id),
                name: a.file_name,
                url: a.file_url,
                type: a.file_type,
              }))}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AcademicRequestModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default AcademicRequestsPage;
