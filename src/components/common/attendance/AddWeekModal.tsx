import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAttendanceWeek } from "@/api/attendance";
import type {
  AttendanceWeek,
  CreateAttendanceWeekPayload,
} from "@/types/attendance";
import { notifySuccess } from "@/lib/toast";

interface AddWeekModalProps {
  courseId: number;
  onClose: () => void;
  onCreated: (week: AttendanceWeek) => void;
}

// Local-time "YYYY-MM-DD", deliberately not toISOString() —
// toISOString() converts to UTC first, which can silently roll the
// date backward/forward near midnight depending on the user's timezone.
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const AddWeekModal = ({ courseId, onClose, onCreated }: AddWeekModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [sessionDate, setSessionDate] = useState(getTodayDateString());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const isValid =
    title.trim().length > 0 &&
    sessionDate.length > 0 &&
    startTime.length > 0 &&
    endTime.length > 0 &&
    endTime > startTime; // "HH:mm" strings compare correctly lexicographically

  const {
    mutate: addWeek,
    isPending,
    error,
  } = useMutation({
    mutationFn: (payload: CreateAttendanceWeekPayload) =>
      createAttendanceWeek(payload),
    onSuccess: (week) => {
      queryClient.invalidateQueries({
        queryKey: ["attendance-weeks", courseId],
      });
      onCreated(week);
      onClose();
      notifySuccess(t("Section added"));
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid || isPending) return;

    addWeek({
      course_id: courseId,
      title: title.trim(),
      session_date: sessionDate,
      start_at: `${sessionDate} ${startTime}:00`,
      end_at: `${sessionDate} ${endTime}:00`,
    });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {t("Add attendance session")}
          </h2>
          <button
            onClick={onClose}
            aria-label={t("Close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="section-title"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              {t("Session title")}
            </label>
            <input
              id="section-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("e.g. Week 4 — Trees")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-gray-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Session date */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="session-date"
                className="text-sm font-semibold text-slate-700"
              >
                {t("Session date")}
              </label>
              <button
                type="button"
                onClick={() => setSessionDate(getTodayDateString())}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                {t("Today")}
              </button>
            </div>
            <input
              id="session-date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Start / end time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start-time"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                {t("Start time")}
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 ps-10 pe-3 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="end-time"
                className="mb-1.5 block text-sm font-semibold text-slate-700"
              >
                {t("End time")}
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute inset-s-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 ps-10 pe-3 text-sm text-slate-900 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>
          </div>

          {startTime && endTime && endTime <= startTime && (
            <p className="text-xs text-red-500">
              {t("End time must be after start time.")}
            </p>
          )}

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {(error as Error).message ||
                t("Something went wrong. Please try again.")}
            </p>
          )}

          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="h-12 w-full rounded-xl bg-teal-600 text-base font-bold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? t("Adding…") : t("Add")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddWeekModal;
