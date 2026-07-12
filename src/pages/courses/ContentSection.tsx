import SectionCard from "@/components/common/SectionCard";
import type { CourseSection } from "@/types/course";

const ContentSection = ({ sections }: { sections: CourseSection[] }) => {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <SectionCard key={section.id} section={section} index={index} defaultOpen={index === 0} />
      ))}
    </div>
  );
};

export default ContentSection;
