import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({
  icon: Icon = FileText,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="col-span-full flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>

      <h3 className="text-lg font-bold text-gray-900">{title}</h3>

      {description && (
        <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
