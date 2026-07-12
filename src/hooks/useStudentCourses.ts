import { courses } from "@/api/courses/student";
import type { Course } from "@/types/course";
import { useQuery } from "@tanstack/react-query";

const useStudentCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: courses,
  });
};

export default useStudentCourses;