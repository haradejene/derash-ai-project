"use client";

interface QuickAction {
  emoji: string;
  label: string;
  icon: string;
  action: string;
}

const actions: QuickAction[] = [
  { emoji: "🍽️", label: "I'd like to book a table for dinner tonight", icon: "restaurant", action: "dinner" },
  { emoji: "💆", label: "I want to book a spa treatment", icon: "spa", action: "spa" },
  { emoji: "🏨", label: "What amenities does the hotel have?", icon: "info", action: "amenities" },
  { emoji: "⚠️", label: "I have a complaint about my room", icon: "report_problem", action: "complaint" },
];

interface QuickActionsProps {
  onSelect: (message: string) => void;
}

export default function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2 px-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => onSelect(action.label)}
          className="bg-secondary-fixed text-on-secondary-fixed px-4 py-2 rounded-full text-sm font-semibold hover:bg-secondary transition-colors hover:text-white flex items-center gap-2"
        >
          <span className="text-base">{action.emoji}</span>
          <span className="truncate max-w-[150px]">{action.label.substring(0, 30)}...</span>
        </button>
      ))}
    </div>
  );
}