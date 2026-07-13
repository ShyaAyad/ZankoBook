import { courses } from "@/api/courses/lecturer";
import type { Course } from "@/types/course";
import { useQuery } from "@tanstack/react-query";

const useLecturerCourses = (enabled: boolean = true) => {
  return useQuery<Course[]>({
    queryKey: ["lecturer-courses"],
    queryFn: courses,
    enabled,
  });
};

export default useLecturerCourses;
