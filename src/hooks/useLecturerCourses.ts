import { courses } from "@/api/courses/lecturer";
import type { Course } from "@/types/course";
import { useQuery } from "@tanstack/react-query";

const useLecturerCourses = () => {
  return useQuery<Course[]>({
    queryKey: ["lecturer-courses"],
    queryFn: courses
  });
};

export default useLecturerCourses;