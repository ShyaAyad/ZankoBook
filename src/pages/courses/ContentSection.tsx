import CourseCard from "@/components/common/CourseCard";
import PageHeader from "@/components/common/PageHeader";
import useStudentCourses from "@/hooks/useStudentCourses";
import { useUserStore } from "@/store/userStore";
import type { Course } from "@/types/course";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

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

  return (
    <div className="mx-[20%]">
      {user?.roles[0].name === "lecturer" ? (
        <PageHeader
          title={t("Courses")}
          description={t("Courses you teach")}
          semester="semester 2"
          year="2025-2025"
        />
      ) : (
        <PageHeader
          title={t("Courses")}
          description={t("Courses you are enrolled in")}
          semester="semester 2"
          year="2025-2025"
        />
      )}

      <div className="grid grid-cols-3 gap-5 mt-5">
        {user?.roles[0].name === "student"
          ? studentCourses.map((course: Course) => (
              <CourseCard
                key={course.id}
                code={course.code}
                title={course.name}
                students={course.students_count}
                sections={course.sections_count}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default ContentSection;
