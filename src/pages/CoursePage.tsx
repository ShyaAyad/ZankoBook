import CourseCard from "@/components/common/CourseCard";
import PageHeader from "@/components/common/PageHeader";
import useStudentCourses from "@/hooks/useStudentCourses";
import useLecturerCourses from "@/hooks/useLecturerCourses";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CourseCardSkeleton from "@/components/common/CourseCardSkeleton";

const CoursePage = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isLecturer = user?.roles?.[0]?.name === "lecturer";

  const studentCourses = useStudentCourses(!isLecturer);
  const lecturerCourses = useLecturerCourses(isLecturer);
  const { data: courses = [], isLoading } = isLecturer
    ? lecturerCourses
    : studentCourses;

  return (
    <div className="mx-[20%]">
      <PageHeader
        title={t("Courses")}
        description={t(
          isLecturer ? "Courses you teach" : "Courses you are enrolled in",
        )}
        semester="semester 2"
        year="2025-2026"
      />

      <div className="grid grid-cols-3 gap-5 mt-5">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))
          : courses.map((course) => (
              <CourseCard
                key={course.id}
                code={course.code}
                title={course.name}
                students={course.students_count}
                sections={course.sections_count}
                onClick={() => navigate(`/courses/${course.id}`)}
              />
            ))}
      </div>
    </div>
  );
};

export default CoursePage;
