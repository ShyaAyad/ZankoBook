import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { X, Paperclip, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeAcademicRequest } from "@/api/academicRequests";
import { notifySuccess } from "@/lib/toast";

export type AcademicRequestType =
  | "leave"
  | "equipment"
  | "transcript"
  | "complaint"
  | "other";

const REQUEST_TYPES: { value: AcademicRequestType; label: string }[] = [
  { value: "leave", label: "Leave" },
  { value: "equipment", label: "Equipment" },
  { value: "transcript", label: "Transcript" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

export interface AcademicRequestPayload {
  type: AcademicRequestType;
  subject: string;
  description: string;
  attachments: File[];
}

interface AcademicRequestModalProps {
  onClose: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const AcademicRequestModal = ({ onClose }: AcademicRequestModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<AcademicRequestType>("leave");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const isValid = subject.trim().length > 0 && description.trim().length > 0;

  const { mutate, isPending, error } = useMutation({
    mutationFn: (payload: AcademicRequestPayload) =>
      makeAcademicRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academic-requests"] });
      notifySuccess(t("Academic request sent"));
      onClose();
    },
  });

  function handleFilesSelected(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setAttachments((prev) => [...prev, ...Array.from(files)]);
    notifySuccess(
      files.length === 1
        ? t("1 file added")
        : t("{{count}} files added", { count: files.length }),
    );
    e.target.value = ""; // allow re-selecting the same file later
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid || isPending) return;

    mutate({
      type,
      subject: subject.trim(),
      description: description.trim(),
      attachments,
    });
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("New request")}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {t("The department turns this into an official letter")}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label={t("Close")}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              {t("Type")}
            </label>
            <div className="flex flex-wrap gap-2">
              {REQUEST_TYPES.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setType(option.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    type === option.value
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t(option.label)}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              {t("Subject")}
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("Short summary")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-semibold text-gray-700"
            >
              {t("Message")}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("Describe your request...")}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
              {t("Attachments")}
              {attachments.length > 0 && (
                <span className="ms-1 font-normal text-gray-400">
                  ({attachments.length})
                </span>
              )}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFilesSelected}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                attachments.length > 0
                  ? "border-teal-300 bg-teal-50/50 text-teal-700 hover:border-teal-400 hover:bg-teal-50"
                  : "border-dashed border-gray-300 text-gray-600 hover:border-teal-400 hover:text-teal-600"
              }`}
            >
              <Paperclip className="h-4 w-4" />
              {attachments.length > 0
                ? t("Add more files")
                : t("Add attachment")}
            </button>

            {attachments.length > 0 && (
              <ul className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-gray-400" />
                      <span className="truncate text-sm text-gray-700">
                        {file.name}
                      </span>
                      <span className="shrink-0 text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      aria-label={t("Remove attachment")}
                      className="shrink-0 text-gray-400 transition-colors hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 text-center">
              {(error as Error).message ||
                t("Something went wrong. Please try again.")}
            </p>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="h-12 w-full rounded-xl bg-teal-600 text-base font-bold text-white shadow-sm transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? t("Sending…") : t("Send request")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AcademicRequestModal;
