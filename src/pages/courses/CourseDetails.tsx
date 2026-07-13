import { useState } from "react";
import { useParams } from "react-router-dom";
import CourseHeader, { type CourseTab } from "@/components/common/CourseHeader";
import ContentSection from "@/pages/courses/ContentSection";
import useStudentCourse from "@/hooks/useStudentCourse";
import useLecturerCourse from "@/hooks/useLecturerCourse";
import { useUserStore } from "@/store/userStore";
import AttendancePage from "@/pages/courses/courseDetails/attendanceSection/index";
import type { CourseSection } from "@/types/course";
// import { useQuery } from "@tanstack/react-query";
// import { getCourseSections } from "@/api/courses/student";

const mockCourse = {
  id: 1,
  name: "Data Structures",
  code: "CS201",
  credit_hours: 3,
  year_level: 2,
  is_active: 1,
  department_id: 1,
  semester: "semester 2",
  created_at: "2026-01-10 09:00:00",
  updated_at: "2026-01-10 09:00:00",
};

export const mockCourseSections: CourseSection[] = [
  {
    id: 3,
    title: "Section A",
    course: mockCourse,
    items: [
      {
        id: 1,
        section_id: 3,
        title: "Lecture 1 — Big-O Notation",
        type: "material",
        url: "https://example.com/lecture1.pdf",
        content: null,
        size: "1.4 MB",
        material_file_type: "application/pdf",
        material_file_name: "lecture1.pdf",
        material_file_url: "https://example.com/lecture1.pdf",
        created_at: "2026-07-08 13:36:26",
        updated_at: "2026-07-08 13:36:26",
      },
      {
        id: 2,
        section_id: 3,
        title: "Slides — Week 1",
        type: "material",
        url: "https://example.com/slides1.pptx",
        content: null,
        size: "3.1 MB",
        material_file_type:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        material_file_name: "slides1.pptx",
        material_file_url: "https://example.com/slides1.pptx",
        created_at: "2026-07-08 13:36:26",
        updated_at: "2026-07-08 13:36:26",
      },
    ],
    submissions: [
      {
        id: 1,
        title: "Homework 1",
        description: "Complete exercises 1-5",
        deadline: "2026-07-15 13:36:43",
        weight: 10,
        attachments: [],
        grade: null,
        feedback: null,
        graded_at: null,
        created_at: "2026-07-08 13:36:43",
        updated_at: "2026-07-08 13:36:43",
      },
    ],
    created_at: "2026-07-08 13:36:26",
    updated_at: "2026-07-08 13:36:26",
  },
  {
    id: 4,
    title: "Section B",
    course: mockCourse,
    items: [
      {
        id: 3,
        section_id: 4,
        title: "Lecture 2 — Singly Linked Lists",
        type: "material",
        url: "https://example.com/lecture2.pdf",
        content: null,
        size: "1.1 MB",
        material_file_type: "application/pdf",
        material_file_name: "lecture2.pdf",
        material_file_url: "https://example.com/lecture2.pdf",
        created_at: "2026-07-09 10:00:00",
        updated_at: "2026-07-09 10:00:00",
      },
    ],
    submissions: [
      {
        id: 2,
        title: "Homework 2",
        description: "Linked list operations",
        deadline: "2026-07-01 13:36:43",
        weight: 10,
        attachments: [],
        grade: 18,
        feedback: "Good work, minor edge case bug.",
        graded_at: "2026-07-05 09:00:00",
        created_at: "2026-06-25 13:36:43",
        updated_at: "2026-07-05 09:00:00",
      },
    ],
    created_at: "2026-07-09 09:00:00",
    updated_at: "2026-07-09 09:00:00",
  },
];

const CourseDetails = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState<CourseTab>("content");
  const user = useUserStore((state) => state.user);
  const isLecturer = user?.roles?.[0]?.name === "lecturer";


  const studentCourse = useStudentCourse(courseId);
  const lecturerCourse = useLecturerCourse(courseId);
  const { data: course } = isLecturer ? lecturerCourse : studentCourse;


  // const { data: sections = [] } = useQuery({
  //   queryKey: ["course-sections", courseId],
  //   queryFn: () => getCourseSections(courseId!),
  //   enabled: !!courseId,
  // });

  const sections = mockCourseSections;

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
