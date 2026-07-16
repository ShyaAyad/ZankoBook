import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type CourseTab = "content" | "attendance" | "grades";

interface CourseHeaderProps {
  code: string;
  title: string;
  colorText?: string;
  activeTab: CourseTab;
  onTabChange: (tab: CourseTab) => void;
}

const tabs: { key: CourseTab; label: string }[] = [
  { key: "content", label: "Content" },
  { key: "attendance", label: "Attendance" },
  { key: "grades", label: "Grades" },
];

const CourseHeader = ({
  code = "Default code",
  title = "Default title",
  colorText = "text-orange-500",
  activeTab,
  onTabChange,
}: CourseHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-gray-400 font-semibold text-sm mb-4 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={16} />
          {t("Courses")}
        </button>

        <p className={cn("font-bold text-sm mb-1", colorText)}>{code}</p>
        <h1 className="font-extrabold text-3xl">{title}</h1>
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-colors",
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400 hover:text-gray-600",
            )}
          >
            {t(tab.label)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseHeader;
