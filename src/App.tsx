import "@/App.css";
import AppLayout from "./Layout/AppLayout";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" />
          <Route path="/requests" />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
