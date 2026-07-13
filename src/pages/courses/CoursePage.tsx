import CourseCard from "@/components/common/CourseCard";
import PageHeader from "@/components/common/PageHeader";
import useStudentCourses from "@/hooks/useStudentCourses";
import useLecturerCourses from "@/hooks/useLecturerCourses";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const CoursePage = () => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isLecturer = user?.roles[0].name === "lecturer";

  const studentCourses = useStudentCourses();
  const lecturerCourses = useLecturerCourses();
  const { data: courses = [] } = isLecturer ? lecturerCourses : studentCourses;

  return (
    <div className="mx-[20%]">
      <PageHeader
        title={t("Courses")}
        description={t(
          isLecturer ? "Courses you teach" : "Courses you are enrolled in",
        )}
        semester="semester 2"
        year="2025-2025"
      />

      <div className="grid grid-cols-3 gap-5 mt-5">
        {courses?.map((course) => (
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
