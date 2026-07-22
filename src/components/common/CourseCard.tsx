import { Badge } from "../ui/badge";
import { Calendar, Users, GraduationCap } from "lucide-react";

interface CourseInfoProps {
  code: string;
  title: string;
  role: string;
  sections: number;
  students: number;
  color?: string;
  onClick: () => void;
}

const CourseCard = ({
  code,
  title,
  role,
  sections,
  students,
  color,
  onClick,
}: CourseInfoProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
    >
      <div className="h-1.5" style={{ backgroundColor: color }} />

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <Badge className="text-white" style={{ backgroundColor: color }}>
            {code}
          </Badge>
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: color ? `${color}1A` : "#f3f4f6",
              color: color || "#374151",
            }}
          >
            <GraduationCap size={13} />
            {role}
          </span>
        </div>

        <p className="font-bold text-xl mb-3 flex-1">{title}</p>

        <div className="flex gap-5 text-gray-400 text-sm">
          <p className="flex items-center gap-1.5">
            <Users size={16} /> {students} students
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar size={16} /> {sections} sections
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
