"use client";

import { z } from "zod";
import { registerPattern } from "@/lib/pattern-registry";

export const actionConfirmSchema = z.object({
  title: z.string().optional().describe("Confirmation title"),
  message: z.string().optional().describe("Confirmation message"),
  details: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional().describe("Key details to confirm"),
  confirmLabel: z.string().optional().describe("Confirm button text"),
  cancelLabel: z.string().optional().describe("Cancel button text"),
  variant: z.enum(["default", "danger", "success"]).optional().describe("Visual style"),
});

export type ActionConfirmProps = z.infer<typeof actionConfirmSchema>;

export function ActionConfirm({
  title = "Confirm Booking",
  message = "Please review your booking details before confirming.",
  details = [
    { label: "Flight", value: "NYC → LAX" },
    { label: "Date", value: "Dec 15, 2024" },
    { label: "Passengers", value: "2 Adults" },
    { label: "Total", value: "$458.00" },
  ],
  confirmLabel = "Confirm Booking",
  cancelLabel = "Cancel",
  variant = "default",
}: ActionConfirmProps) {
  const variantStyles = {
    default: {
      accent: "bg-blue-600 hover:bg-blue-500",
      icon: "✓",
      iconBg: "bg-blue-500/20 text-blue-400",
    },
    danger: {
      accent: "bg-red-600 hover:bg-red-500",
      icon: "⚠",
      iconBg: "bg-red-500/20 text-red-400",
    },
    success: {
      accent: "bg-emerald-600 hover:bg-emerald-500",
      icon: "✓",
      iconBg: "bg-emerald-500/20 text-emerald-400",
    },
  };

  const style = variantStyles[variant || "default"];

  return (
    <div className="action-confirm p-5 rounded-xl bg-gray-800 border border-gray-700/50 max-w-md">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${style.iconBg}`}>
          <span className="text-lg">{style.icon}</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{message}</p>
        </div>
      </div>

      {/* Details */}
      {details && details.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700/30">
          <div className="space-y-2">
            {details.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.label}</span>
                <span className="text-gray-200 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
          {cancelLabel}
        </button>
        <button className={`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${style.accent}`}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

export const actionConfirmSourceCode = `interface ActionConfirmProps {
  title: string;
  message: string;
  details?: { label: string; value: string }[];
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger" | "success";
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ActionConfirm({
  title,
  message,
  details = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ActionConfirmProps) {
  const variantStyles = {
    default: "bg-blue-600 hover:bg-blue-500",
    danger: "bg-red-600 hover:bg-red-500",
    success: "bg-emerald-600 hover:bg-emerald-500",
  };

  return (
    <div className="p-5 rounded-xl bg-gray-800 border border-gray-700/50 max-w-md">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{message}</p>

      {/* Details */}
      {details.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-gray-900/50 space-y-2">
          {details.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="text-gray-200 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button onClick={onCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg">
          {cancelLabel}
        </button>
        <button onClick={onConfirm} className={\`flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-lg \${variantStyles[variant]}\`}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}`;

registerPattern({
  id: "action-confirm",
  name: "Action Confirm",
  category: "action",
  domains: ["booking", "e-commerce", "orders", "travel", "payments", "checkout"],
  description: "Confirmation dialog with details summary and action buttons",
  component: ActionConfirm,
  sourceCode: actionConfirmSourceCode,
  propsSchema: actionConfirmSchema,
  defaultProps: {
    title: "Confirm Booking",
    message: "Please review your booking details before confirming.",
    details: [
      { label: "Flight", value: "NYC → LAX" },
      { label: "Date", value: "Dec 15, 2024" },
      { label: "Passengers", value: "2 Adults" },
      { label: "Total", value: "$458.00" },
    ],
    confirmLabel: "Confirm Booking",
    cancelLabel: "Cancel",
    variant: "default",
  },
});
