import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AssessmentsUIState } from "@/types/grades";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AssessmentCardProps {
  assessment: AssessmentsUIState;
  isPending: boolean;
  handleUpdateAssessment: (
    tempId: string,
    changes: Partial<AssessmentsUIState>,
  ) => void;
  handleDeleteAssessment: (tempId: string) => void;
  handleRestoreAssessment: (tempId: string) => void;
}

const AssessmentCard = ({
  assessment,
  isPending,
  handleUpdateAssessment,
  handleDeleteAssessment,
  handleRestoreAssessment,
}: AssessmentCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      key={assessment.tempId}
      className={cn(
        "rounded-2xl border p-6 transition-all duration-200",

        assessment.state === "clean" && "border-slate-200 bg-slate-50/50",

        assessment.state === "edited" && "border-amber-200 bg-amber-50",

        assessment.state === "new" && "border-emerald-200 bg-emerald-50",

        assessment.state === "deleted" &&
          "border-rose-200 bg-rose-50 opacity-70",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {t("Assessment")}
        </span>

        {assessment.state === "new" && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {t("New")}
          </span>
        )}

        {assessment.state === "edited" && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            {t("Edited")}
          </span>
        )}

        {assessment.state === "deleted" && (
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
            {t("Deleted")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-[1fr_140px_140px_64px] items-end gap-4">
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-400">
            {t("Activity name")}
          </label>

          <Input
            value={assessment.title}
            disabled={isPending || assessment.state === "deleted"}
            readOnly={assessment.state === "deleted"}
            placeholder={t("Activity")}
            onChange={(e) =>
              handleUpdateAssessment(assessment.tempId, {
                title: e.target.value,
              })
            }
            className={cn(
              assessment.state === "deleted" && "line-through text-slate-500",
            )}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-400">
            {t("Max points")}
          </label>

          <Input
            type="number"
            min={0}
            disabled={isPending || assessment.state === "deleted"}
            readOnly={assessment.state === "deleted"}
            value={assessment.max_mark}
            onChange={(e) =>
              handleUpdateAssessment(assessment.tempId, {
                max_mark: Number(e.target.value),
              })
            }
            className={cn(
              assessment.state === "deleted" && "line-through text-slate-500",
            )}
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-400">
            {t("Weight %")}
          </label>

          <Input
            type="number"
            min={0}
            max={100}
            disabled={isPending || assessment.state === "deleted"}
            readOnly={assessment.state === "deleted"}
            value={assessment.weight}
            onChange={(e) =>
              handleUpdateAssessment(assessment.tempId, {
                weight: Number(e.target.value),
              })
            }
            className={cn(
              assessment.state === "deleted" && "line-through text-slate-500",
            )}
          />
        </div>

        {assessment.state !== "deleted" ? (
          <Button
            size="icon"
            variant="ghost"
            disabled={isPending}
            onClick={() => handleDeleteAssessment(assessment.tempId)}
            className="h-11 w-11 cursor-pointer rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => handleRestoreAssessment(assessment.tempId)}
            className="h-11 cursor-pointer rounded-xl border-emerald-200 bg-white px-4 text-emerald-700 hover:bg-emerald-50"
          >
            {t("Undo")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AssessmentCard;
