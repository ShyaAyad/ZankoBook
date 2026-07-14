import { useTranslation } from "react-i18next";

interface StudentGradeCardProps {
  activityName: string;
  activityWeight: number;
  grade: number | null;
  maxGrade: number;
  feedback?: string | null;
  status?: string | null;
}

const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : Math.round(n * 10) / 10;
};

export default function StudentGradeCard({
  activityName,
  activityWeight,
  grade,
  maxGrade,
  feedback,
}: StudentGradeCardProps) {
  const { t } = useTranslation();

  const progressPercentage =
    grade === null ? 0 : Math.min(100, Math.max(0, (grade / maxGrade) * 100));

  const isGraded = grade !== null;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] dark:border dark:border-border dark:bg-card dark:shadow-none">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex flex-col">
          <h3 className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-foreground">
            {t(activityName)}
          </h3>

          <span className="mt-1 text-xs font-medium text-gray-400 dark:text-muted-foreground">
            {toNumber(activityWeight)}%
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-5 sm:gap-8">
          <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-muted sm:w-28">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isGraded ? "bg-[#e36a25]" : "bg-gray-300"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {isGraded ? (
            <div className="w-16 text-right text-[15px] font-bold text-gray-900 dark:text-foreground">
              {toNumber(grade)} / {toNumber(maxGrade)}
            </div>
          ) : (
            <div className="w-16 text-right text-sm font-medium text-slate-400">
              {t("Not graded")}
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500 dark:border-border dark:text-muted-foreground">
          {feedback}
        </p>
      )}
    </div>
  );
}
