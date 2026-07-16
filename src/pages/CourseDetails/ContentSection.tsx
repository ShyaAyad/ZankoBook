import { useState } from "react";
import { FolderOpen } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import type { CourseSection } from "@/types/course";
import { useParams } from "react-router-dom";
import AddSectionModal from "@/components/common/AddSectionModal";
import { getCourseSections } from "@/api/courses/student";
import { useQuery } from "@tanstack/react-query";
import SectionCardSkeleton from "@/components/common/SectionCardSkeleton";
import EmptyState from "@/components/common/EmptyState";

const ContentSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const { courseId } = useParams();
  const isLecturer = user?.roles[0].name === "lecturer";

  const { data: sections = [], isLoading } = useQuery<CourseSection[]>({
    queryKey: ["course-sections", courseId],
    queryFn: () => getCourseSections(courseId!),
    enabled: !!courseId,
  });

  const hasSections = sections.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {isLecturer && (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white py-6 border-teal-500 border-dashed font-semibold cursor-pointer"
        >
          + Add section
        </Button>
      )}

      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => <SectionCardSkeleton key={i} />)
      ) : !hasSections ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <EmptyState
            icon={FolderOpen}
            title={isLecturer ? "No sections yet" : "No content available yet"}
            description={
              isLecturer
                ? "Add a section to start organizing materials and submissions for this course."
                : "Your lecturer hasn't added any content for this course yet. Check back later."
            }
            action={
              isLecturer
                ? {
                    label: "Add section",
                    onClick: () => setIsModalOpen(true),
                  }
                : undefined
            }
          />
        </div>
      ) : (
        sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            index={index}
            defaultOpen={index === 0}
          />
        ))
      )}

      {isModalOpen && courseId && (
        <AddSectionModal
          courseId={courseId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ContentSection;
