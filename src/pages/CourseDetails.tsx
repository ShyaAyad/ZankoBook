import { useState } from "react";
import { useParams } from "react-router-dom";
import CourseHeader, { type CourseTab } from "@/components/common/CourseHeader";
import ContentSection from "@/pages/CourseDetails/ContentSection";
import useStudentCourse from "@/hooks/useStudentCourse";
import useLecturerCourse from "@/hooks/useLecturerCourse";
import { useUserStore } from "@/store/userStore";
import AttendancePage from "@/pages/CourseDetails/attendanceSection/index"
import { useQuery } from "@tanstack/react-query";
import { getCourseSections } from "@/api/courses/student";
import GradesSection from "@/pages/CourseDetails/gradeSection/index"

const CourseDetails = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<CourseTab>("content");
  const user = useUserStore((state) => state.user);
  const isLecturer = user?.roles?.[0]?.name === "lecturer";

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

      {activeTab === "content" && <ContentSection sections={sections} />}
      {activeTab === "attendance" && <AttendancePage />}
      {activeTab === "grades" && <GradesSection />}
    </div>
  );
};

export default CourseDetails;
