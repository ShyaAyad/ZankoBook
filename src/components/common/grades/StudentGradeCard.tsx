import { useTranslation } from "react-i18next";

interface StudentGradeCardProps {
  activityName: string;
  activityWeight: number;
  grade: number;
  maxGrade: number;
}

export default function StudentGradeCard({
  activityName,
  activityWeight,
  grade,
  maxGrade,
}: StudentGradeCardProps) {
  const { t } = useTranslation();

  // Calculate the percentage for the progress bar width
  const progressPercentage = Math.min(
    100,
    Math.max(0, (grade / maxGrade) * 100),
  );

  return (
    <div className="flex w-full items-center justify-between rounded-2xl bg-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] dark:bg-card dark:border dark:border-border dark:shadow-none">
      {/* Left section: Activity Name and Weight */}
      <div className="flex flex-col">
        <h3 className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-foreground">
          {t(activityName)}
        </h3>
        <span className="mt-1 text-xs font-medium text-gray-400 dark:text-muted-foreground">
          {activityWeight}%
        </span>
      </div>

      {/* Right section: Progress Bar and Grade */}
      <div className="flex items-center gap-5 sm:gap-8">
        {/* Visual Progress Bar */}
        <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-muted sm:w-28">
          <div
            className="h-full rounded-full bg-[#e36a25] transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Numeric Grade */}
        <div className="w-14 text-right text-[15px] font-bold text-gray-900 dark:text-foreground">
          {grade} / {maxGrade}
        </div>
      </div>
    </div>
  );
}
