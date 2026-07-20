import { getCourseGradebook } from "@/api/grades";
import type { Gradebook } from "@/types/grades";
import { useQuery } from "@tanstack/react-query";

const useLecturerGradebook = (
  courseId: number | undefined,
  enabled: boolean = true,
) => {
  return useQuery<Gradebook>({
    queryKey: ["lecturer-gradebook", courseId],
    queryFn: () => getCourseGradebook(courseId!),
    enabled: enabled && courseId != null,
  });
};

export default useLecturerGradebook;
