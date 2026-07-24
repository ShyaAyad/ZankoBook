import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarClock,
  Download,
  FileText,
  Layers3,
} from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { getAssignmentDetails } from "@/api/calendar";
import { useUserStore } from "@/store/userStore";
import StudentSubmissionPanel from "@/components/common/StudentSubmissionPanel";

function formatDateTime(value: string): string {
  return new Date(value.replace(" ", "T")).toLocaleString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatFileSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function CalendarAssignmentDetailsPage() {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const user = useUserStore((state) => state.user);
  const role = user?.roles[0]?.name;
  const id = Number(assignmentId);

  const query = useQuery({
    queryKey: ["assignment-details", id],
    queryFn: () => getAssignmentDetails(id),
    enabled: role === "student" && Number.isFinite(id) && id > 0,
  });

  if (role === "lecturer") return <Navigate to="/" replace />;

  return (
    <div className="mx-auto max-w-4xl">
      <button
        type="button"
        onClick={() => navigate("/calendar")}
        className="mb-5 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white"
      >
        <ArrowLeft size={18} />
        Back to calendar
      </button>

      {query.isLoading ? (
        <div className="grid min-h-80 place-items-center rounded-3xl border border-slate-200 bg-white">
          <p className="text-sm font-medium text-slate-500">Loading assignment…</p>
        </div>
      ) : query.isError || !query.data ? (
        <div className="grid min-h-80 place-items-center rounded-3xl border border-slate-200 bg-white p-6 text-center">
          <div>
            <p className="font-bold text-slate-900">Could not load assignment</p>
            <p className="mt-2 text-sm text-slate-500">
              {(query.error as Error)?.message || "Assignment was not found."}
            </p>
            <button
              type="button"
              onClick={() => query.refetch()}
              className="mt-4 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-600 text-white">
              <FileText size={24} />
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
              {query.data.course_assessment.title}
            </h1>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
              <CalendarClock size={18} />
              {formatDateTime(query.data.course_assessment.due_at)}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Maximum mark
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {query.data.course_assessment.max_mark}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Weight
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900">
                {query.data.course_assessment.weight}%
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Section
              </p>
              <p className="mt-3 flex items-center gap-2 font-bold text-slate-900">
                <Layers3 size={18} className="text-teal-600" />
                {query.data.section.title}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">Description</h2>
            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
              {query.data.description || "No description provided."}
            </p>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">Attachments</h2>
            {query.data.attachments.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No attachments.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {query.data.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={attachment.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-slate-50"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 text-teal-700">
                      <FileText size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-slate-900">
                        {attachment.file_name}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {attachment.file_type} · {formatFileSize(attachment.file_size)}
                      </span>
                    </span>
                    <Download size={19} className="shrink-0 text-slate-400" />
                  </a>
                ))}
              </div>
            )}
          </section>

          <StudentSubmissionPanel
            submissionId={query.data.id}
            dueAt={query.data.course_assessment.due_at}
          />
        </div>
      )}
    </div>
  );
}
