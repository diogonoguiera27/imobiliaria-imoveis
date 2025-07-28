import * as React from "react";

interface SwitchProps {
  label?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, checked, onCheckedChange }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer select-none">
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          tabIndex={0}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors relative ${
            checked ? "bg-red-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
              checked ? "translate-x-5 left-0.5" : "left-0.5"
            }`}
          />
        </div>
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";