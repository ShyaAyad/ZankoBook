import { useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { X, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeAcademicRequest } from "@/api/academicRequests";
import { notifySuccess } from "@/lib/toast";
import type { AcademicRequestPayload } from "@/types/academicRequests";
import AttachmentPreview from "../AttachmentPreview";
import { useUserStore } from "@/store/userStore";

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

interface AcademicRequestModalProps {
  onClose: () => void;
}

const AcademicRequestModal = ({ onClose }: AcademicRequestModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUserStore();
  const isLecturer = user?.roles[0]?.name === "lecturer";
  const isScopeIdNull = user?.scopes[0].scope_id === null;

  const [type, setType] = useState<AcademicRequestType>("leave");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);

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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);

      notifySuccess(
        newFiles.length === 1
          ? t("1 file added")
          : t("{{count}} files added", { count: newFiles.length }),
      );
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid || isPending) return;

    mutate({
      type,
      subject: subject.trim(),
      description: description.trim(),
      files,
      department_id:
        isLecturer && !isScopeIdNull ? user.scopes[0].scope_id! : undefined,
    });
  }

  return (
    <>
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
                {files.length > 0 && (
                  <span className="ms-1 font-normal text-gray-400">
                    ({files.length})
                  </span>
                )}
              </label>

              <input
                ref={fileInputRef}
                name="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-semibold transition-colors ${
                  files.length > 0
                    ? "border-teal-300 bg-teal-50/50 text-teal-700 hover:border-teal-400 hover:bg-teal-50"
                    : "border-dashed border-gray-300 text-gray-600 hover:border-teal-400 hover:text-teal-600"
                }`}
              >
                <Paperclip className="h-4 w-4" />
                {files.length > 0 ? t("Add more files") : t("Add attachment")}
              </button>

              <AttachmentPreview files={files} onRemove={removeFile} />
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
    </>
  );
};

export default AcademicRequestModal;
