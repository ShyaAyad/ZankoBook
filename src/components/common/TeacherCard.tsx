import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeacherCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  avatarColor?: string;
  onClick?: () => void;
}

function getInitials(name: string): string {
  const parts = name
    .replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, "")
    .trim()
    .split(/\s+/);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const TeacherCard = ({
  name,
  email,
  avatarUrl,
  avatarColor = "bg-orange-500",
  onClick,
}: TeacherCardProps) => {
  const initials = getInitials(name);

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4",
        onClick && "cursor-pointer hover:shadow-md transition-shadow",
      )}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-11 h-11 rounded-full object-cover shrink-0"
        />
      ) : (
        <div
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0",
            avatarColor,
          )}
        >
          {initials}
        </div>
      )}

      <div className="min-w-0">
        <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
        <a
          href={`mailto:${email}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 truncate"
        >
          <Mail className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{email}</span>
        </a>
      </div>
    </div>
  );
};

export default TeacherCard;
