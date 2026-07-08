import "@/App.css";
import AppLayout from "./Layout/AppLayout";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" />
          <Route path="/requests" />
          <Route path="/profile" />
        </Route>
      </Routes>
    </>
  );
}

export default App;
