import { useState, useEffect } from "react";
import { Pencil, Save, Send, ClipboardList } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import useLecturerCourse from "@/hooks/useLecturerCourse";

import { getCourseGradebook } from "@/api/grades";

import StudentGradeRow from "@/components/common/grades/StudentGradeRow";
import LecturerGradesSectionSkeleton from "@/components/common/grades/LecturerGradesSectionSkeleton";
import EditAssessmentsModal from "@/components/common/grades/EditAssessmentsModal";
import EmptyState from "@/components/common/EmptyState";
import { saveStudentGrades } from "@/api/grades";
import { useMutation } from "@tanstack/react-query";
import { type SaveGradebookPayload } from "@/types/grades";
import { notifySuccess, notifyError } from "@/lib/toast";

const LecturerGradesSection = () => {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const [activitiesOpen, setActivitiesOpen] = useState(false);
  const [gradebookState, setGradebookState] = useState<
    Record<number, Record<number, number | null>>
  >({});

  const { data: course } = useLecturerCourse(courseId);

  const { data: gradebook, isLoading } = useQuery({
    queryKey: ["gradebook", course?.id],
    queryFn: () => getCourseGradebook(course!.id),
    enabled: !!course,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: saveStudentGrades,
    onSuccess: () => {
      notifySuccess(t("Grades saved successfully"));
    },
    onError: (error) => {
      notifyError(error.message);
    },
  });

  const hasAssessments = (gradebook?.assessments.length ?? 0) > 0;

  const totalWeight = gradebook?.assessments.reduce(
    (sum, assessment) => sum + assessment.weight,
    0,
  );

  const handleSave = () => {
    if (!course || !gradebook) return;

    const payload: SaveGradebookPayload = {
      academic_year_id: 1,
      marks: gradebook.students.flatMap((student) => {
        return gradebook.assessments.map((assessment) => ({
          assessment_id: assessment.id,
          student_id: student.id,
          mark: gradebookState[student.id]?.[assessment.id] ?? null,
          feedback: null,
          status: "valid",
        }));
      }),
    };

    mutate({
      courseId: course.id,
      payload,
    });
  };

  useEffect(() => {
    const initializeState = () => {
      if (!gradebook) return;

      const state: Record<number, Record<number, number | null>> = {};

      for (const student of gradebook.students) {
        state[student.id] = {};

        for (const mark of student.marks) {
          state[student.id][mark.assessment_id] = mark.mark;
        }
      }

      setGradebookState(state);
    };

    initializeState();
  }, [gradebook]);

  if (isLoading) {
    return <LecturerGradesSectionSkeleton />;
  }

  if (!gradebook) return null;

  if (!hasAssessments) {
    return (
      <>
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <EmptyState
            icon={ClipboardList}
            title={t("No assessments yet")}
            description={t(
              "Add assessments like quizzes, assignments, or exams to start recording grades for this course.",
            )}
            action={{
              label: t("Add assessment"),
              onClick: () => setActivitiesOpen(true),
            }}
          />
        </div>

        <EditAssessmentsModal
          open={activitiesOpen}
          onOpenChange={setActivitiesOpen}
          assessments={gradebook.assessments}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">
            {t("Click a cell to edit marks")}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {t("Total weight")}:
              <span className="ml-1 font-bold text-emerald-600">
                {totalWeight}%
              </span>
            </span>

            <Button
              variant="secondary"
              className="gap-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100"
              onClick={() => setActivitiesOpen(true)}
            >
              <Pencil className="h-4 w-4" />
              {t("Edit activities")}
            </Button>
          </div>
        </div>

        {/* Gradebook */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t("Student")}
                </th>

                {gradebook.assessments.map((assessment) => (
                  <th
                    key={assessment.id}
                    className="min-w-30 px-4 py-5 text-center"
                  >
                    <div className="text-xs font-bold uppercase tracking-wide text-slate-600">
                      {assessment.title}
                    </div>

                    <div className="mt-1 text-sm font-bold text-orange-600">
                      {assessment.weight}% · /{assessment.max_mark}
                    </div>
                  </th>
                ))}

                <th className="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-orange-600">
                  {t("Total")}
                </th>
              </tr>
            </thead>

            <tbody>
              {gradebook.students.map((student) => (
                <StudentGradeRow
                  key={student.id}
                  student={student}
                  assessments={gradebook.assessments}
                  grades={gradebookState[student.id] ?? {}}
                  onGradeChange={(assessmentId, value) => {
                    setGradebookState((prev) => ({
                      ...prev,
                      [student.id]: {
                        ...prev[student.id],
                        [assessmentId]: value,
                      },
                    }));
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSave}
            disabled={isPending}
            className="h-12 rounded-xl bg-teal-600 px-8 text-white hover:bg-teal-700"
          >
            <Save className="mr-2 h-4 w-4" />
            {isPending ? t("Saving...") : t("Save")}
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-xl border-teal-600 bg-white px-8 text-teal-600 hover:bg-teal-50"
          >
            <Send className="mr-2 h-4 w-4" />
            {t("Send marks to department")}
          </Button>

          <p className="text-sm text-slate-400">
            {t("Goes to the department in e-Zanko")}
          </p>
        </div>
      </div>

      <EditAssessmentsModal
        open={activitiesOpen}
        onOpenChange={setActivitiesOpen}
        assessments={gradebook.assessments}
      />
    </>
  );
};

export default LecturerGradesSection;
