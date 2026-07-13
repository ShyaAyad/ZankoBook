import { useUserStore } from "@/store/userStore";
import StudentAttendanceSection from "./components/StudentAttendanceSection";
import LecturerAttendanceSection from "./components/LecturerAttendanceSection";

const AttendancePage = () => {
  const user = useUserStore((state) => state.user);
  const userRole = user?.roles?.[0]?.name;

  if (userRole == "student") return <StudentAttendanceSection />;
  if (userRole == "lecturer") return <LecturerAttendanceSection />;
};

export default AttendancePage;
