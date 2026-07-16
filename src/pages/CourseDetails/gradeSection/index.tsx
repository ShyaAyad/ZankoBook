import StudentGradesSection from "@/pages/CourseDetails/gradeSection/components/StudentGradesSection";
import LecturerGradesSection from "@/pages/CourseDetails/gradeSection/components/LecturerGradesSection";
import { useUserStore } from "@/store/userStore";

const GradesSection = () => {
  const { user } = useUserStore();

  if (user?.roles?.[0]?.name === "student") return <StudentGradesSection />;
  if (user?.roles?.[0]?.name === "lecturer") return <LecturerGradesSection />;
};

export default GradesSection;
