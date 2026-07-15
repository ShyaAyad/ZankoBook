import "@/App.css";
import AppLayout from "@/Layout/AppLayout";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RequestsPage from "./pages/AcademicRequestsPage";
import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import Profile from "@/pages/Profile";
import CoursePage from "./pages/CoursePage";
import CoureseDetails from "./pages/CourseDetails";
import CalendarPage from "./pages/CalendarPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/" element={<CoursePage />} />
            <Route path="/courses/:courseId" element={<CoureseDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
