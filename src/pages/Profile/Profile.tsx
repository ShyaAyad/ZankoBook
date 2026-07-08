import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  return (
    <div className="mx-[20%] w-[40%]">
      <h1 className="font-extrabold text-2xl my-5">Profile</h1>

      {/* user info */}
      <div className="flex gap-5 items-center border border-gray-100 shadow-md px-5 py-4 rounded-lg my-3">
        <div className="w-20 h-20 flex items-center justify-center shadow-sm rounded-full bg-teal-700 text-white font-extrabold">
          UN
        </div>
        <div>
          <p className="font-bold">User name</p>
          <p className="text-sm text-gray-500">email</p>
          <Badge className="mt-1 bg-teal-100 text-teal-700">status</Badge>
        </div>
      </div>

      {/* languages */}
      <div></div>

      {/* logout */}
      <button className="w-full flex items-center justify-center gap-2 text-red-400 border border-red-300 shadow-md px-5 py-3 rounded-lg my-3 hover:bg-red-50 transition-colors">
        <LogOut size={18} />
        <p>Log Out</p>
      </button>
    </div>
  );
};

export default Profile;