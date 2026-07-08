import { useUserStore } from "@/store/userStore";
import { Navigate, Outlet } from "react-router-dom";
import type { UserRole } from "@/types/auth";

interface Props {
  allowedRoles?: UserRole[];
}

const ProtectedRoutes = ({ allowedRoles }: Props) => {
  const user = useUserStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    const roleNames = user.scopes.map((s) => s.role.name);
    const hasAccess = roleNames.some((role) => allowedRoles.includes(role));
    if (!hasAccess) return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
