import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Upload,
  FileText,
  Pen,
  Trash,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CourseSection, SectionItem } from "@/types/course";
import { useUserStore } from "@/store/userStore";
import { deleteSection } from "@/api/courseSection";
import SubmissionModal from "./SubmissionModal";
import EditSectionModal from "./EditSectionModal";
import MaterialModal from "./MaterialModal";
import { Button } from "../ui/button";
import { deleteSectionItem } from "@/api/sectionItem";
import EditMaterialModal from "./EditMaterialModal";

interface SectionCardProps {
  section: CourseSection;
  index: number;
  defaultOpen?: boolean;
}

const mimeToLabel = (mime: string) => {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
  };
  return map[mime] ?? mime?.split("/")[1]?.toUpperCase() ?? "FILE";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

const SectionCard = ({ section, defaultOpen = false }: SectionCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeModal, setActiveModal] = useState<
    "material" | "submission" | "edit" | null
  >(null);
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const user = useUserStore((state) => state.user);
  const isLecturer = user?.roles[0].name === "lecturer";
  const queryClient = useQueryClient();
  const courseId = section.course.id;

  const { mutate: removeSection, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteSection", section.id],
    mutationFn: () => deleteSection(section.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
    },
  });

  const { mutate: removeSectionItem } = useMutation({
    mutationKey: ["deleteSectionItem"],
    mutationFn: (itemId: number) => deleteSectionItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
    },
  });

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* section tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5"
      >
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="font-bold">{section.title}</p>
            <p className="text-sm text-gray-400">
              {section.items.length} Material
              {section.submissions.length > 0 &&
                ` · ${section.submissions.length} Submission`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isLecturer && (
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModal("edit");
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                aria-label="Edit"
              >
                <Pen size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection();
                }}
                disabled={isDeleting}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors disabled:opacity-60"
                aria-label="Delete"
              >
                <Trash size={14} />
              </button>
            </div>
          )}
          {isOpen ? (
            <ChevronUp size={18} className="text-gray-400" />
          ) : (
            <ChevronDown size={18} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* section items */}
      {isOpen && (
        <div className="px-5">
          <div className="border-t border-gray-100" />
          <div className="divide-y divide-gray-100">
            {section.items.map((item) => (
              <div
                key={`item-${item.id}`}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-100" />
                  <div>
                    <p className="font-bold text-sm">
                      {item.title || item.material_file_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {mimeToLabel(item.material_file_type)}
                      {item.size && ` · ${item.size}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isLecturer && (
                    <>
                      <Button
                        onClick={() => setEditingItem(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                      >
                        <Pen size={14} />
                      </Button>
                      <Button
                        onClick={() => removeSectionItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors disabled:opacity-60"
                      >
                        <Trash size={14} />
                      </Button>
                    </>
                  )}
                  <a
                    href={item.material_file_url || item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-teal-100 hover:bg-teal-200 transition-colors text-teal-600 font-semibold text-sm px-5 py-2 rounded-lg"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}

            {section.submissions.map((submission) => {
              const isGraded = submission.graded_at !== null;
              return (
                <div
                  key={`submission-${submission.id}`}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-100" />
                    <div>
                      <p className="font-bold text-sm">{submission.title}</p>
                      <p className="text-xs text-teal-500 font-medium">
                        Due · {formatDate(submission.deadline)}
                      </p>
                    </div>
                  </div>

                  {isGraded ? (
                    <span className="bg-teal-100 text-teal-600 font-semibold text-sm px-5 py-2 rounded-lg">
                      {submission.grade}
                      {submission.weight != null ? `/${submission.weight}` : ""}
                      · Grade
                    </span>
                  ) : (
                    <button className="bg-teal-500 hover:bg-teal-600 transition-colors text-white font-semibold text-sm px-5 py-2 rounded-lg">
                      Upload
                    </button>
                  )}
                </div>
              );
            })}

            {isLecturer && (
              <div className="flex gap-3 py-4">
                <button
                  onClick={() => setActiveModal("material")}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold text-sm py-3 rounded-xl"
                >
                  <Upload size={16} />
                  Material
                </button>
                <button
                  onClick={() => setActiveModal("submission")}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-semibold text-sm py-3 rounded-xl"
                >
                  <FileText size={16} />
                  Submission
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeModal === "material" && (
        <MaterialModal
          sectionId={section.id}
          courseId={courseId}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "submission" && (
        <SubmissionModal
          sectionId={section.id}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "edit" && (
        <EditSectionModal
          sectionId={section.id}
          courseId={courseId}
          initialTitle={section.title}
          onClose={() => setActiveModal(null)}
        />
      )}
      {editingItem && (
        <EditMaterialModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default SectionCard;
