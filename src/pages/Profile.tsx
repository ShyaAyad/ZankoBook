import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/userStore";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/auth";

const getInitials = (name?: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  const initials =
    parts.length > 1
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0].slice(0, 2);
  return initials.toUpperCase();
};

const Profile = () => {
  const { user, clearAuth } = useUserStore();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    meta: { suppressErrorToast: true },
    onSuccess: () => {
      clearAuth();
      navigate("/login", { replace: true });
    },
    onError: () => {
      console.error("Couldn't logout!");
    },
  });

  const activeStatus = user?.is_active;

  const handleLogout = () => {
    mutate();
  };

  return (
    <div className="mx-[20%] w-[40%]">
      <h1 className="font-extrabold text-2xl my-5">{t("Profile")}</h1>

      {/* user info */}
      <div className="flex gap-5 items-center border border-gray-100 shadow-md px-5 py-4 rounded-lg my-3">
        <div className="w-20 h-20 flex items-center justify-center shadow-sm rounded-full bg-teal-700 text-white font-extrabold">
          {getInitials(user?.name)}
        </div>
        <div>
          <p className="font-bold">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <Badge className="mt-1 bg-teal-100 text-teal-700">
            {activeStatus === 1 ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      {/* languages */}
      <div></div>

      {/* logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 text-red-400 border border-red-300 shadow-md px-5 py-3 rounded-lg my-3 hover:bg-red-50 transition-colors cursor-pointer"
      >
        <LogOut size={18} />
        {isPending ? <p>{t("Logging out...")}</p> : <p>{t("Log Out")}</p>}
      </button>
    </div>
  );
};

export default Profile;
