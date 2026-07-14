import { useState } from "react";
import SectionCard from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import type { CourseSection } from "@/types/course";
import { useParams } from "react-router-dom";
import AddSectionModal from "@/components/common/AddSectionModal";

const ContentSection = ({ sections }: { sections: CourseSection[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const { courseId } = useParams();
  const isLecturer = user?.roles[0].name === "lecturer";

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

      {sections.map((section, index) => (
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
