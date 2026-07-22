import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Upload,
  FileText,
  Link2,
  StickyNote,
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
import GradeSubmissionModal from "./GradeSubmissionModal";
import StudentSubmissionRow from "./StudentSubmissionRow";
import { getStudentSubmissions } from "@/api/courses/lecturer";
import type { StudentSubmission } from "@/types/submission";

interface SectionCardProps {
  section: CourseSection;
  index: number;
  defaultOpen?: boolean;
  teacherRole: string;
}

const mimeToLabel = (mime: string) => {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "image/jpeg": "JPG",
    "image/png": "PNG",
    "image/gif": "GIF",
    "video/mp4": "MP4",
    "video/quicktime": "MOV",
    "video/x-msvideo": "AVI",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.ms-powerpoint": "PPT",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "PPTX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  };
  return map[mime] ?? mime?.split("/")[1]?.toUpperCase() ?? "FILE";
};

type ItemKind = "lecture" | "link" | "note";

const getItemKind = (item: SectionItem): ItemKind => {
  if (item.type === "link") return "link";
  if (item.type === "note") return "note";
  return "lecture";
};

const kindStyles: Record<
  ItemKind,
  { badge: string; label: string; icon: typeof FileText; text: string }
> = {
  lecture: {
    badge: "bg-indigo-50 text-indigo-600",
    label: "text-indigo-600",
    icon: FileText,
    text: "Lecture",
  },
  link: {
    badge: "bg-violet-50 text-violet-600",
    label: "text-violet-600",
    icon: Link2,
    text: "Link",
  },
  note: {
    badge: "bg-amber-50 text-amber-600",
    label: "text-amber-600",
    icon: StickyNote,
    text: "Note",
  },
};

const SectionCard = ({
  section,
  index,
  defaultOpen = false,
  teacherRole,
}: SectionCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeModal, setActiveModal] = useState<
    "material" | "submission" | "edit" | null
  >(null);
  const [editingItem, setEditingItem] = useState<SectionItem | null>(null);
  const [expandedItemIds, setExpandedItemIds] = useState<Set<number>>(
    new Set(),
  );
  const [gradingAttachments, setGradingAttachments] = useState<
    StudentSubmission[] | null
  >(null);
  const [gradingContext, setGradingContext] = useState<{
    assessmentId: number;
    maxScore: string | number;
  } | null>(null);
  const user = useUserStore((state) => state.user);
  const isLecturer = user?.roles[0].name === "lecturer";

  // getting the roles
  const isPrimaryLecturer = teacherRole === "primary_lecturer";
  const isAssistantLecturer = teacherRole === "assistant_lecturer";
  const isLabInstructor = teacherRole === "lab_instructor";

  // getting teacher id
  const teacherId = section?.teacher.user.id;
  const isAllowedToModify = user?.id == teacherId;

  console.log(
    "teacher id is: ",
    teacherId,
    " user ID is: ",
    user?.id,
    " Is allowed ot modify, ",
    isAllowedToModify,
    " teacher role is: ",
    teacherRole,
    " is primary: ",
    isPrimaryLecturer,
  );

  const queryClient = useQueryClient();
  const courseId = section.course.id;

  // delete section
  const { mutate: removeSection, isPending: isDeleting } = useMutation({
    mutationKey: ["deleteSection", section.id],
    mutationFn: () => deleteSection(section.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
    },
  });

  // delete section item
  const { mutate: removeSectionItem } = useMutation({
    mutationKey: ["deleteSectionItem"],
    mutationFn: (itemId: number) => deleteSectionItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-sections"] });
    },
  });

  const toggleDescription = (itemId: number) => {
    setExpandedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* section tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-extrabold text-sm">
            {index + 1}
          </div>
          <div className="text-left">
            <p className="font-bold">{section.title}</p>
            <p className="text-sm text-gray-400">
              {section.items.length} Material
              {section.submissions.length > 0 &&
                ` · ${section.submissions.length} Submission`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLecturer && (
            <div className="flex items-center gap-2 text-sm">
              {(isAllowedToModify || isPrimaryLecturer) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal("edit");
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 transition-colors"
                  aria-label="Edit"
                >
                  <Pen size={14} />
                </button>
              )}
              {(isAllowedToModify || isPrimaryLecturer) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSection();
                  }}
                  disabled={isDeleting}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-transparent text-gray-500 transition-colors disabled:opacity-60"
                  aria-label="Delete"
                >
                  <Trash size={14} />
                </button>
              )}
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
            {section.items.map((item) => {
              const kind = getItemKind(item);
              const style = kindStyles[kind];
              const Icon = style.icon;
              const hasDescription =
                (kind === "note" || kind === "lecture") && !!item.description;
              const isExpanded = expandedItemIds.has(item.id);

              return (
                <div key={`item-${item.id}`} className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${style.badge}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">
                          {item.title || "No title"}
                        </p>
                        <p
                          className={`text-xs font-semibold uppercase tracking-wide flex items-center gap-1.5 ${style.label}`}
                        >
                          <span className="w-1 h-1 rounded-full bg-current" />
                          {style.text}
                          {kind === "lecture" && (
                            <span className="text-gray-400 normal-case font-medium">
                              · {mimeToLabel(item.material_file_type)}
                              {item.size && ` · ${item.size}`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {hasDescription && (
                        <button
                          onClick={() => toggleDescription(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 transition-colors"
                          aria-label={
                            isExpanded ? "Hide description" : "Show description"
                          }
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )}
                        </button>
                      )}
                      {isLecturer &&
                        (isAllowedToModify || isPrimaryLecturer) && (
                          <>
                            <Button
                              onClick={() => setEditingItem(item)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 bg-white hover:bg-gray-50 text-gray-500 transition-colors"
                            >
                              <Pen size={14} />
                            </Button>
                            <Button
                              onClick={() => removeSectionItem(item.id)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-100 bg-white hover:bg-orange-50 hover:text-orange-600 hover:border-transparent text-gray-500 transition-colors disabled:opacity-60"
                            >
                              <Trash size={14} />
                            </Button>
                          </>
                        )}
                      {(item.material_file_url || item.url) && (
                        <a
                          href={item.material_file_url || item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-teal-50 hover:bg-teal-600 hover:text-white transition-colors text-teal-700 font-semibold text-sm px-5 py-2 rounded-lg"
                        >
                          View
                        </a>
                      )}
                    </div>
                  </div>

                  {hasDescription && isExpanded && (
                    <div className="mt-3 ml-14 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}

            {section.submissions.map((submission) => {
              const assessment = submission.course_assessment;

              if (
                (isLecturer && isAllowedToModify) ||
                (isLecturer && isPrimaryLecturer)
              ) {
                return (
                  <div
                    key={`submission-${submission.id}`}
                    className="flex items-center justify-between py-4 gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">
                        {assessment.title}
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        const data = await getStudentSubmissions(assessment.id);
                        setGradingAttachments(data);
                        setGradingContext({
                          assessmentId: assessment.id,
                          maxScore: assessment.max_mark,
                        });
                      }}
                      className="bg-teal-600 hover:bg-teal-700 transition-colors text-white font-semibold text-sm px-5 py-2 rounded-lg shrink-0"
                    >
                      Grade
                    </button>
                  </div>
                );
              }

              return (
                <StudentSubmissionRow
                  key={`submission-${submission.id}`}
                  submissionId={submission.id}
                  assessment={assessment}
                  isLecturer={isLecturer}
                  isPrimaryLecturer={isPrimaryLecturer}
                  isAllowedToModify={isAllowedToModify}
                  grade={async () => {
                    const data = await getStudentSubmissions(assessment.id);
                    setGradingAttachments(data);
                    setGradingContext({
                      assessmentId: assessment.id,
                      maxScore: assessment.max_mark,
                    });
                  }}
                />
              );
            })}

            {isLecturer && (
              <div className="flex gap-3 py-4">
                <button
                  onClick={() => setActiveModal("material")}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-100 hover:border-transparent transition-colors text-gray-700 font-semibold text-sm py-3 rounded-xl"
                >
                  <Upload size={16} />
                  Upload
                </button>
                <button
                  onClick={() => setActiveModal("submission")}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 border border-gray-100 hover:border-transparent transition-colors text-gray-700 font-semibold text-sm py-3 rounded-xl"
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
      {gradingAttachments !== null && gradingContext && (
        <GradeSubmissionModal
          assessmentId={gradingContext.assessmentId}
          attachments={gradingAttachments}
          maxScore={gradingContext.maxScore}
          onClose={() => {
            setGradingAttachments(null);
            setGradingContext(null);
          }}
        />
      )}
    </div>
  );
};

export default SectionCard;
