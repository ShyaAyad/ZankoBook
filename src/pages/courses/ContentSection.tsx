import CourseCard from "@/components/common/CourseCard";
import PageHeader from "@/components/common/PageHeader";
import useStudentCourses from "@/hooks/useStudentCourses";
import { useUserStore } from "@/store/userStore";
import type { Course } from "@/types/course";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import SectionCard from "@/components/common/SectionCard";
import type { CourseSection } from "@/types/course";

const ContentSection = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: studentCourses = [], isLoading } = useStudentCourses();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );

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
