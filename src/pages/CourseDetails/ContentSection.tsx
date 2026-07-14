import { useState } from "react";
import SectionCard from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import type { CourseSection } from "@/types/course";
import { useParams } from "react-router-dom";
import AddSectionModal from "@/components/common/AddSectionModal";
import { getCourseSections } from "@/api/courses/student";
import { useQuery } from "@tanstack/react-query";
import SectionCardSkeleton from "@/components/common/SectionCardSkeleton";

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

  return (
    <div className="flex flex-col gap-4">
      {isLecturer && (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-100 text-teal-600 py-6 border-teal-500 border-dashed hover:bg-teal-100 font-semibold"
        >
          + Add section
        </Button>
      )}

      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <SectionCardSkeleton key={i} />
          ))
        : sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              defaultOpen={index === 0}
            />
          ))}

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
