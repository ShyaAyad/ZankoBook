import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CourseHeader, { type CourseTab } from "@/components/common/CourseHeader";
import ContentSection from "@/pages/courses/ContentSection";
import useStudentCourse from "@/hooks/useStudentCourse";
import useLecturerCourse from "@/hooks/useLecturerCourse";
import { getCourseSections } from "@/api/courses/student";
import { useUserStore } from "@/store/userStore";

const CourseSection = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<CourseTab>("content");
  const user = useUserStore((state) => state.user);
  const isLecturer = user?.roles[0].name === "lecturer";

  const studentCourse = useStudentCourse(courseId);
  const lecturerCourse = useLecturerCourse(courseId);
  const { data: course } = isLecturer ? lecturerCourse : studentCourse;

  const { data: sections = [] } = useQuery({
    queryKey: ["course-sections", courseId],
    queryFn: () => getCourseSections(courseId!),
    enabled: !!courseId,
  });

  if (!course) return null;

  return (
    <div className="mx-[20%] mt-5">
      <CourseHeader
        code={course.code}
        title={course.name}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "content" && (
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <ContentSection key={section.id} section={section} />
          ))}
        </div>
      )}
      {activeTab === "attendance" && <div>{/* attendance component here */}</div>}
      {activeTab === "grades" && <div>{/* grades component here */}</div>}
    </div>
  );
};

export default CourseSection;