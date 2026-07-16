import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCourseById } from "@/api/courses/student";
import type { Course } from "@/types/course";

const useStudentCourse = (courseId?: string, enabled: boolean = true) => {
  const queryClient = useQueryClient();

  return useQuery<Course>({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId!),
    initialData: () => {
      const cachedCourses = queryClient.getQueryData<Course[]>(["courses"]);
      return cachedCourses?.find((c) => c.id === Number(courseId));
    },
    enabled: !!courseId && enabled,
  });
};

export default useStudentCourse;
