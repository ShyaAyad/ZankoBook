import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseStudents } from "@/api/attendance";
import StudentsTable from "@/components/common/StudentsTable";
import { type CourseStudent } from "@/types/attendance";
import StudentsTableSkeleton from "@/components/common/StudentTableSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { Users } from "lucide-react";

const CourseStudentsPage = () => {
  const { courseId } = useParams();

  const {
    data: students = [],
    isLoading,
    isError,
    error,
  } = useQuery<CourseStudent[]>({
    queryKey: ["course-students", courseId],
    queryFn: () => getCourseStudents(Number(courseId)),
    enabled: !!courseId,
  });

  if (isLoading) return <StudentsTableSkeleton />;

  if (students.length === 0) {
    <EmptyState
      icon={Users}
      title="No students for this course"
      description="Students enrolled in this course will appear here"
    />;
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-red-100 shadow-sm p-8 text-center text-sm text-red-600">
        {error instanceof Error ? error.message : "Failed to load students."}
      </div>
    );
  }

  return <StudentsTable students={students} />;
};

export default CourseStudentsPage;
