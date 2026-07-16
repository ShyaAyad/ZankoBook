import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import type {
  AssessmentsUIState,
  GradebookAssessment,
  ModifyAssessmentsPayload,
} from "@/types/grades";
import { modifyAssessments } from "@/api/grades";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useLecturerCourse from "@/hooks/useLecturerCourse";
import { notifyError, notifySuccess } from "@/lib/toast";
import AssessmentCard from "./AssessmentCard";
import { useParams } from "react-router-dom";

interface EditActivitiesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessments: GradebookAssessment[];
}

const EditActivitiesModal = ({
  open,
  onOpenChange,
  assessments,
}: EditActivitiesModalProps) => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const { data: course } = useLecturerCourse(courseId);
  const [modifiableAssessments, setModifiableAssessments] = useState<
    AssessmentsUIState[]
  >([]);
  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const queryClient = useQueryClient();

  // When the modal is opened, we need to create a copy of the assessments
  useEffect(() => {
    const initializeAssessmentsState = () => {
      if (!open) return;

      setModifiableAssessments(
        assessments.map((assessment) => ({
          ...assessment,
          tempId: crypto.randomUUID(), // Used to identify the assessment
          state: "clean",
        })),
      );
    };

    initializeAssessmentsState();
  }, [open, assessments]);

  const { mutate, isPending } = useMutation({
    mutationFn: modifyAssessments,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["gradebook", course?.id],
      });
      notifySuccess(t("Assessments saved successfully"));
      onOpenChange(false);
    },
    onError: (error) => {
      notifyError(error.message);
    },
  });

  const totalWeight = modifiableAssessments
    .filter((assessment) => assessment.state !== "deleted")
    .reduce((sum, assessment) => sum + assessment.weight, 0);

  const modalHasChanges = modifiableAssessments.some(
    (assessment) => assessment.state !== "clean",
  );

  // Intercept every close path — the X button, backdrop click, and
  const requestClose = () => {
    if (modalHasChanges) {
      setConfirmDiscardOpen(true);
      return;
    }
    onOpenChange(false);
  };

  const handleConfirmDiscard = () => {
    setConfirmDiscardOpen(false);
    onOpenChange(false);
  };

  // used to give us this for free.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, modalHasChanges]);

  const handleUpdateAssessment = (
    tempId: string,
    changes: Partial<AssessmentsUIState>,
  ) => {
    setModifiableAssessments((prev) =>
      prev.map((assessment) => {
        if (assessment.tempId !== tempId) return assessment;

        const updated = {
          ...assessment,
          ...changes,
        };

        // New assessments stay new forever.
        if (updated.state === "new") {
          return updated;
        }

        const original = assessments.find((a) => a.id === updated.id)!;

        const isEdited =
          updated.title !== original.title ||
          updated.weight !== original.weight ||
          updated.max_mark !== original.max_mark ||
          updated.type !== original.type;

        return {
          ...updated,
          state: isEdited ? "edited" : "clean",
        };
      }),
    );
  };

  const handleAddAssessment = () => {
    setModifiableAssessments((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        title: "",
        weight: 0,
        max_mark: 100,
        type: "activity",
        state: "new",
      },
    ]);
  };

  const handleDeleteAssessment = (tempId: string) => {
    setModifiableAssessments((prev) =>
      prev.flatMap((assessment) => {
        if (assessment.tempId !== tempId) return [assessment];

        if (assessment.state === "new") return [];

        return [
          {
            ...assessment,
            state: "deleted",
          },
        ];
      }),
    );
  };

  const handleRestoreAssessment = (tempId: string) => {
    setModifiableAssessments((prev) =>
      prev.map((assessment) => {
        if (assessment.tempId !== tempId) return assessment;

        const original = assessments.find((a) => a.id === assessment.id);

        if (!original) {
          return assessment;
        }

        const isEdited =
          assessment.title !== original.title ||
          assessment.weight !== original.weight ||
          assessment.max_mark !== original.max_mark ||
          assessment.type !== original.type;

        return {
          ...assessment,
          state: isEdited ? "edited" : "clean",
        };
      }),
    );
  };

  const handleModifyAssessments = () => {
    const payload: ModifyAssessmentsPayload = {
      create: modifiableAssessments
        .filter((assessment) => assessment.state === "new")
        .map((a) => ({
          title: a.title,
          weight: a.weight,
          max_mark: a.max_mark,
        })),

      update: modifiableAssessments
        .filter((a) => a.state === "edited")
        .map((assessment) => ({
          id: assessment.id!,
          title: assessment.title,
          weight: assessment.weight,
          max_mark: assessment.max_mark,
        })),

      delete: modifiableAssessments
        .filter((assessment) => assessment.state === "deleted")
        .map((assessment) => assessment.id!),
    };

    if (
      payload.create.length === 0 &&
      payload.update.length === 0 &&
      payload.delete.length === 0
    ) {
      onOpenChange(false);
      return;
    }

    mutate({ courseId: course!.id, payload });
  };

  if (!open) return null;

  return (
    <>
      <div
        onClick={requestClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-sm"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-8 py-6">
            <h2 className="text-3xl font-extrabold text-slate-900">
              {t("Activities & weights")}
            </h2>

            <button
              onClick={requestClose}
              aria-label={t("Close")}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-8 py-6">
            {modifiableAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.tempId}
                assessment={assessment}
                isPending={isPending}
                handleUpdateAssessment={handleUpdateAssessment}
                handleDeleteAssessment={handleDeleteAssessment}
                handleRestoreAssessment={handleRestoreAssessment}
              />
            ))}

            <Button
              variant="outline"
              onClick={handleAddAssessment}
              disabled={isPending}
              className="h-14 w-full cursor-pointer rounded-2xl border-dashed border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("Add activity")}
            </Button>
          </div>

          {/* Fixed footer */}
          <div className="shrink-0 space-y-4 border-t border-slate-100 px-8 py-6">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-4">
              <span className="font-semibold text-slate-600">
                {t("Total weight")}
              </span>

              <span
                className={`text-lg font-bold ${
                  totalWeight === 100 ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {totalWeight}%
              </span>
            </div>

            <Button
              onClick={handleModifyAssessments}
              disabled={!modalHasChanges || isPending}
              className="h-14 w-full cursor-pointer rounded-2xl bg-teal-600 text-base hover:bg-teal-700"
            >
              {isPending ? t("Saving...") : t("Save changes")}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDiscardOpen}
        onOpenChange={setConfirmDiscardOpen}
        onConfirm={handleConfirmDiscard}
        title={t("Discard changes?")}
        description={t(
          "You have unsaved changes to activities and weights. If you close now, they will be lost.",
        )}
        confirmLabel={t("Discard")}
        cancelLabel={t("Keep editing")}
        variant="destructive"
      />
    </>
  );
};

export default EditActivitiesModal;
