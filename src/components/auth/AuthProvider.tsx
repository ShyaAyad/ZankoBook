import React, { useEffect } from "react";
import { useUserStore } from "../../store/userStore";
import { ImSpinner2 } from "react-icons/im";
import type { User } from "../../types/auth";
import { getProfile } from "../../api/auth";

function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const { setUser, setIsAuthLoading, isAuthLoading } = useUserStore();

  useEffect(() => {
    // fetch the user and set it as global state
    const bootstrap = async () => {
      setIsAuthLoading(true);

      try {
        const user: User = await getProfile();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    bootstrap();
  }, [setIsAuthLoading, setUser]);

  // Show spinner while fetching the user
  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ImSpinner2 className="animate-spin text-2xl text-muted-foreground" />
      </div>
    );
  }

  // Render the app
  return <>{children}</>;
}

export default AuthProvider;
