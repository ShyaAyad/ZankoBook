import Header from "@/components/Layout/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100 overflow-hidden">
      <Header />
      <div className="flex h-full pt-20.5">
        <main className="flex-1 min-w-0 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
