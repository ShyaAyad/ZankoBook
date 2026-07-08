import "@/App.css";
import AppLayout from "@/Layout/AppLayout";
import { Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import ProtectedRoutes from "@/components/auth/ProtectedRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<AppLayout />}>
            <Route path="/" />
            <Route path="/requests" />
            <Route path="/profile" />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
