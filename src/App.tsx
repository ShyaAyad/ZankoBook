import "@/App.css";
import AppLayout from "@/Layout/AppLayout";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import ProtectedRoutes from "@/components/auth/ProtectedRoutes";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/" />
            <Route path="/requests" />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
