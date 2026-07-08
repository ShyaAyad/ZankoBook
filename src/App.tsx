import "@/App.css";
import AppLayout from "./Layout/AppLayout";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
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
