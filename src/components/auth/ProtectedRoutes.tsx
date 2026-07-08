import { useUserStore } from "@/store/userStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const user = useUserStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoutes;
