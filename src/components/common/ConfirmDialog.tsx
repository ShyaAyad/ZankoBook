import { AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "default";
  icon?: LucideIcon;
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  icon: Icon = AlertTriangle,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-2xl",
            variant === "destructive" ? "bg-red-50" : "bg-slate-100",
          )}
        >
          <Icon
            className={cn(
              "h-6 w-6",
              variant === "destructive" ? "text-red-500" : "text-slate-500",
            )}
          />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="h-11 flex-1 cursor-pointer rounded-xl bg-slate-100 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className={cn(
              "h-11 flex-1 cursor-pointer rounded-xl text-sm font-semibold text-white transition-colors",
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-teal-600 hover:bg-teal-700",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
