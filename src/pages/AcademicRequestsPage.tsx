import { useState } from "react";
import { Plus } from "lucide-react";
import RequestCard from "@/components/common/AcademicRequestCard";
import AcademicRequestModal from "@/components/common/AcademicRequestModal";
import type { AcademicRequest } from "@/types/academicRequests";

const requests: AcademicRequest[] = [
  {
    id: 1,
    type: "type",
    status: "approved",
    subject: "title",
    description: "description",
    created_at: "date",
    updated_at: "date",
    attachments: [
      {
        id: 1,
        file_name: "file name",
        file_url: "file url",
        file_size: 1,
        file_type: "file type",
      },
    ],
    user: {
      id: 0,
      name: "fllan user",
    },
    department: {
      id: 0,
      name: "fisar department",
    },
  },
];

const AcademicRequestsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requests</h1>
          <p className="text-gray-500 mt-1">
            Requests are forwarded to your department in e-Zanko
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-3 rounded-xl transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          New request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <RequestCard
            key={request.id}
            type={request.type}
            status={request.status}
            subject={request.subject}
            description={request.description}
            dateIssued={request.created_at}
            attachmentCount={request.attachments.length}
            onViewLetter={() => console.log("view letter", request.id)}
          />
        ))}
      </div>

      {isModalOpen && (
        <AcademicRequestModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default AcademicRequestsPage;
