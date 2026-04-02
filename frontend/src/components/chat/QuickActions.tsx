"use client";

interface QuickAction {
  emoji: string;
  label: string;
  icon: string;
  action: string;
  isError?: boolean;
}

const actions: QuickAction[] = [
  { emoji: "🏠", label: "What's for dinner?", icon: "restaurant", action: "dinner" },
  { emoji: "💆", label: "In-room spa service", icon: "spa", action: "spa" },
  { emoji: "🏨", label: "Hotel Amenities", icon: "info", action: "amenities" },
];

interface QuickActionsProps {
  onSelect: (message: string) => void;
}

export default function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.label)}
          className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-colors hover:text-white flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">{action.icon}</span>
          {action.label}
        </button>
      ))}
    </div>
  );
}