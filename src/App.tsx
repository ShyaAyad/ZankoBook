import "@/App.css";
import AppLayout from "@/Layout/AppLayout";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RequestsPage from "./pages/AcademicRequestsPage";
import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import Profile from "@/pages/Profile";
import CoursePage from "./pages/courses/CoursePage";
import CourseSection from "./pages/courses/CourseSection";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/" element={<CoursePage />} />
            <Route path="/courses/:courseId" element={<CourseSection />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
