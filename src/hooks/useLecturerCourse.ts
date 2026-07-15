import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourseById } from "@/api/courses/lecturer";
import type { Course } from "@/types/course";

const useLecturerCourse = (courseId?: string, enabled: boolean = true) => {
  const queryClient = useQueryClient();

  return useQuery<Course>({
    queryKey: ["lecturer-course", courseId],
    queryFn: () => getCourseById(courseId!),
    initialData: () => {
      const cachedCourses = queryClient.getQueryData<Course[]>([
        "lecturer-courses",
      ]);
      return cachedCourses?.find((c) => c.id === Number(courseId));
    },
    enabled: !!courseId && enabled,
  });
};

export default useLecturerCourse;
