import { Badge } from "../ui/badge";
import { Calendar, Users } from "lucide-react";

interface CourseInfoProps {
  code: string;
  title: string;
  sections: number;
  students: number;
  color?: string;
  onClick: () => void;
}

const CourseCard = ({
  code,
  title,
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
      <div className={`h-1.5`} style={{ backgroundColor: color }} />

      <div className="p-5 flex flex-col flex-1">
        <Badge className={`text-white mb-3`} style={{ backgroundColor: color }}>
          {code}
        </Badge>

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
