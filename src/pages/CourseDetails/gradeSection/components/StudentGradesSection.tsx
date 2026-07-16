import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import StudentGradeCard from "@/components/common/grades/StudentGradeCard";
import useStudentCourse from "@/hooks/useStudentCourse";
import { getMyGrades } from "@/api/grades";
import { Skeleton } from "@/components/ui/skeleton";

const toNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : Math.round(n * 10) / 10;
};

const StudentGradesSection = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();

  const { data: course } = useStudentCourse(courseId);

  const { data, isLoading } = useQuery({
    queryKey: ["my-grades", course?.id],
    queryFn: () => getMyGrades(course!.id),
    enabled: !!course,
  });

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-36 rounded-3xl" />

        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const totalMarksEarned = data.assessments.reduce(
    (sum, assessment) => sum + toNumber(assessment.mark),
    0,
  );

  const totalMaxPossible = data.assessments.reduce(
    (sum, assessment) => sum + toNumber(assessment.max_mark),
    0,
  );

  return (
    <div className="max-w-3xl space-y-5">
      {/* Summary Card */}
      <div className="rounded-3xl bg-[#e36a25] p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          {t("Your total")}
        </p>

        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-7xl font-extrabold tracking-tight text-white">
            {totalMarksEarned}
          </span>
          <span className="text-2xl font-semibold text-white/60">
            / {totalMaxPossible}
          </span>
        </div>

        <p className="mt-1 text-sm font-medium text-white/70">{t("marks")}</p>

        {/* Progress track */}
        <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-700 ease-out"
            style={{
              width: `${totalMaxPossible === 0 ? 0 : Math.min(100, (totalMarksEarned / totalMaxPossible) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Assessment Cards */}
      <div className="space-y-4">
        {data.assessments.map((assessment) => (
          <StudentGradeCard
            key={assessment.assessment_id}
            activityName={assessment.title}
            activityWeight={assessment.weight}
            grade={assessment.mark}
            maxGrade={assessment.max_mark}
            feedback={assessment.feedback}
            status={assessment.status}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentGradesSection;
