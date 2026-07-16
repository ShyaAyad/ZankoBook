import logo from "@/assets/ZankoBookLogo.png";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/auth";
import { useUserStore } from "@/store/userStore";

const navItems = [
  { label: "Courses", to: "/", matchPrefixes: ["/courses"] },
  { label: "Requests", to: "/requests" },
  { label: "Calendar", to: "/calendar" },
  { label: "Profile", to: "/profile" },
];

type Language = "en" | "ku" | "ar";

const languages: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ku", label: "KU" },
  { code: "ar", label: "AR" },
];

const Header = () => {
  const [activeLanguage, setActiveLanguage] = useState<Language>("en");
  const { user, clearAuth } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();

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

  function handleLogout() {
    mutate();
  }
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-20.5 items-center border-b border-border bg-card max-md:static max-md:grid max-md:h-auto max-md:min-h-20.5">
      <div className="flex h-full w-67.5 shrink-0 items-center gap-3 border-e border-border bg-card px-4.5 max-lg:w-60 max-md:h-20.5 max-md:w-full max-md:border-e-0 max-md:border-b">
        <img
          src={logo}
          alt="ZankoBook logo"
          className="h-12 w-12 rounded-md shrink-0 object-contain max-sm:h-11.5 max-sm:w-11.5"
        />

        <div className="min-w-0">
          <div className="text-[19px] font-[850] leading-none tracking-[-0.03em] text-foreground">
            ZankoBook
          </div>
          <div className="mt-1.5 text-[11.5px] font-semibold leading-tight text-muted-foreground">
            Moodle
          </div>
        </div>
      </div>

      <div className="flex h-full min-w-0 flex-1 items-center justify-between gap-5 bg-card px-6.5 max-md:h-auto max-md:flex-wrap max-md:p-4">
        <div className="flex gap-10">
          {navItems.map((item) => {
            const isPrefixActive = item.matchPrefixes?.some((prefix) =>
              location.pathname.startsWith(prefix),
            );

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "ghost" }),
                    isActive || isPrefixActive
                      ? "bg-teal-200 text-teal-700 font-bold hover:bg-teal-200 hover:text-teal-500"
                      : "text-muted-foreground hover:bg-white hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="flex items-end justify-center">
          <div className="flex gap-2 items-center justify-center px-2 border-r">
            {languages.map((l) => (
              <Button
                key={l.code}
                onClick={() => setActiveLanguage(l.code)}
                className={cn(
                  activeLanguage === l.code
                    ? "bg-teal-500 hover:bg-teal-500"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400",
                )}
              >
                {l.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <div className="mx-2">
              <p className="text-md font-bold">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.roles[0].name}</p>
            </div>
            {isPending ? (
              <Loader2 />
            ) : (
              <LogOut
                onClick={handleLogout}
                className="cursor-pointer text-gray-500 mx-3 items-center justify-center"
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
