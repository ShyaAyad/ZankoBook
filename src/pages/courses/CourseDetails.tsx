import { useState } from "react";
import { useParams } from "react-router-dom";
import CourseHeader, { type CourseTab } from "@/components/common/CourseHeader";
import ContentSection from "@/pages/courses/ContentSection";
import useStudentCourse from "@/hooks/useStudentCourse";
import useLecturerCourse from "@/hooks/useLecturerCourse";
import { useUserStore } from "@/store/userStore";
import AttendancePage from "@/pages/courses/courseDetails/attendanceSection/index";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<CourseTab>("content");
  const user = useUserStore((state) => state.user);
  const isLecturer = user?.roles[0].name === "lecturer";

  const studentCourse = useStudentCourse(courseId);
  const lecturerCourse = useLecturerCourse(courseId);
  const { data: course } = isLecturer ? lecturerCourse : studentCourse;

  if (!course) return null;

  return (
    <div className="mx-[20%] mt-5">
      <CourseHeader
        code={course.code}
        title={course.name}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "content" && <ContentSection />}
      {activeTab === "attendance" && <AttendancePage />}
      {activeTab === "grades" && <div>{/* grades component here */}</div>}
    </div>
  );
};

export default CourseDetails;
