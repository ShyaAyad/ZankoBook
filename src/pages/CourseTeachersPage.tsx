import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseLectuers } from "@/api/courses/lecturer";
import type { CourseTeacher } from "@/types/course";
import TeacherCard from "@/components/common/TeacherCard";
import TeacherCardSkeleton from "@/components/common/TeacherCardSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { FileText } from "lucide-react";

const avatarColors = [
  "bg-orange-500",
  "bg-teal-600",
  "bg-blue-500",
  "bg-pink-500",
];

const CourseTeachersPage = () => {
  const { courseId } = useParams();

  const {
    data: teachers = [],
    isLoading,
    isError,
    error,
  } = useQuery<CourseTeacher[]>({
    queryKey: ["course-teachers", courseId],
    queryFn: () => getCourseLectuers(Number(courseId)),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <TeacherCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 text-center text-sm text-red-600">
        {error instanceof Error ? error.message : "Failed to load teachers."}
      </div>
    );
  }

  if (teachers.length === 0) {
    <EmptyState
      icon={FileText}
      title="No teachers for this course"
      description="Teachers assigned to this course will appear here"
    />;
  }

  return (
    <div className="flex flex-col gap-5">
      {teachers.map((teacher, i) => (
        <TeacherCard
          key={teacher.id}
          name={teacher.user.name}
          email={teacher.user.email}
          avatarColor={avatarColors[i % avatarColors.length]}
        />
      ))}
    </div>
  );
};

export default CourseTeachersPage;
