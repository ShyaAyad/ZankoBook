import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { CourseSection } from "@/types/course";

const mimeToLabel = (mime: string) => {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  };
  return map[mime] ?? mime?.split("/")[1]?.toUpperCase() ?? "FILE";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });

const SectionCard = ({
  section,
  index,
  defaultOpen = false,
}: {
  section: CourseSection;
  index: number;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* section tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5"
      >
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center w-12 h-12 bg-orange-100 text-orange-600 rounded-xl">
            <span className="text-[10px] font-bold leading-none">SEC</span>
            <span className="text-base font-extrabold leading-none">{index + 1}</span>
          </div>
          <div className="text-left">
            <p className="font-bold">{section.title}</p>
            <p className="text-sm text-gray-400">
              {section.items.length} Material
              {section.submissions.length > 0 && ` · ${section.submissions.length} Assignment`}
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>

      {/* section items */}
      {isOpen && (
        <div className="px-5">
          <div className="border-t border-gray-100" />
          <div className="divide-y divide-gray-100">
            {section.items.map((item) => (
              <div key={`item-${item.id}`} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-100" />
                  <div>
                    <p className="font-bold text-sm">{item.title || item.material_file_name}</p>
                    <p className="text-xs text-gray-400">
                      {mimeToLabel(item.material_file_type)}
                      {item.size && ` · ${item.size}`}
                    </p>
                  </div>
                </div>
                <a
                  href={item.material_file_url || item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-orange-100 hover:bg-orange-200 transition-colors text-orange-600 font-semibold text-sm px-5 py-2 rounded-lg"
                >
                  Get
                </a>
              </div>
            ))}

            {section.submissions.map((submission) => {
              const isGraded = submission.graded_at !== null;
              return (
                <div key={`submission-${submission.id}`} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-100" />
                    <div>
                      <p className="font-bold text-sm">{submission.title}</p>
                      {isGraded ? (
                        <p className="text-xs text-green-600 font-medium">
                          Graded · {submission.grade}
                          {submission.weight != null ? ` / ${submission.weight}` : ""}
                        </p>
                      ) : (
                        <p className="text-xs text-orange-500 font-medium">
                          Due · {formatDate(submission.deadline)}
                        </p>
                      )}
                    </div>
                  </div>

                  {isGraded ? (
                    <button className="bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold text-sm px-5 py-2 rounded-lg">
                      View Feedback
                    </button>
                  ) : (
                    <button className="bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold text-sm px-5 py-2 rounded-lg">
                      Upload
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionCard;