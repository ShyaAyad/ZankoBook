import { courses } from "@/api/courses/student";
import type { Course } from "@/types/course";
import { useQuery } from "@tanstack/react-query";

const useStudentCourses = (enabled: boolean = true) => {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: courses,
    enabled,
  });
};

export default useStudentCourses;
