"use client";

import { z } from "zod";
import { registerPattern } from "@/lib/pattern-registry";

export const statusTrackerSchema = z.object({
  title: z.string().optional().describe("Tracker title"),
  currentStep: z.number().optional().describe("Current step index (0-based)"),
  steps: z.array(z.object({
    label: z.string(),
    description: z.string().optional(),
    timestamp: z.string().optional(),
  })).optional().describe("Array of steps"),
});

export type StatusTrackerProps = z.infer<typeof statusTrackerSchema>;

export function StatusTracker({
  title = "Order Status",
  currentStep = 2,
  steps = [
    { label: "Order Placed", description: "Your order has been confirmed", timestamp: "Dec 10, 2:30 PM" },
    { label: "Processing", description: "Preparing your items", timestamp: "Dec 10, 4:15 PM" },
    { label: "Shipped", description: "On the way to you", timestamp: "Dec 11, 9:00 AM" },
    { label: "Delivered", description: "Package delivered" },
  ],
}: StatusTrackerProps) {
  return (
    <div className="status-tracker p-5 rounded-xl bg-gray-800 border border-gray-700/50 max-w-md">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="space-y-0">
        {steps?.map((step, index) => {
          const isCompleted = index < (currentStep || 0);
          const isCurrent = index === currentStep;
          const isPending = index > (currentStep || 0);

          return (
            <div key={index} className="relative flex gap-4">
              {/* Vertical Line */}
              {index < (steps?.length || 0) - 1 && (
                <div 
                  className={`absolute left-[11px] top-6 w-0.5 h-full ${
                    isCompleted ? "bg-emerald-500" : "bg-gray-700"
                  }`}
                />
              )}
              
              {/* Status Dot */}
              <div className="relative z-10 mt-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted ? "bg-emerald-500" : 
                  isCurrent ? "bg-blue-500 ring-4 ring-blue-500/30" : 
                  "bg-gray-700"
                }`}>
                  {isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>

              {/* Content */}
              <div className={`pb-6 ${isPending ? "opacity-50" : ""}`}>
                <p className={`font-medium ${isCurrent ? "text-blue-400" : "text-white"}`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-400 mt-0.5">{step.description}</p>
                )}
                {step.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">{step.timestamp}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const statusTrackerSourceCode = `interface Step {
  label: string;
  description?: string;
  timestamp?: string;
}

interface StatusTrackerProps {
  title: string;
  currentStep: number;
  steps: Step[];
}

export function StatusTracker({ title, currentStep, steps }: StatusTrackerProps) {
  return (
    <div className="p-5 rounded-xl bg-gray-800 border border-gray-700/50 max-w-md">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      
      <div className="space-y-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div key={index} className="relative flex gap-4">
              {/* Vertical connector line */}
              {index < steps.length - 1 && (
                <div className={\`absolute left-[11px] top-6 w-0.5 h-full \${
                  isCompleted ? "bg-emerald-500" : "bg-gray-700"
                }\`} />
              )}
              
              {/* Status indicator */}
              <div className={\`w-6 h-6 rounded-full flex items-center justify-center \${
                isCompleted ? "bg-emerald-500" : 
                isCurrent ? "bg-blue-500 ring-4 ring-blue-500/30" : "bg-gray-700"
              }\`}>
                {isCompleted && <CheckIcon />}
                {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>

              {/* Step content */}
              <div className="pb-6">
                <p className="font-medium text-white">{step.label}</p>
                {step.description && <p className="text-sm text-gray-400">{step.description}</p>}
                {step.timestamp && <p className="text-xs text-gray-500">{step.timestamp}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}`;

registerPattern({
  id: "status-tracker",
  name: "Status Tracker",
  category: "status",
  domains: ["orders", "shipping", "logistics", "e-commerce", "delivery", "tracking"],
  description: "Multi-step progress tracker with timestamps and completion states",
  component: StatusTracker,
  sourceCode: statusTrackerSourceCode,
  propsSchema: statusTrackerSchema,
  defaultProps: {
    title: "Order Status",
    currentStep: 2,
    steps: [
      { label: "Order Placed", description: "Your order has been confirmed", timestamp: "Dec 10, 2:30 PM" },
      { label: "Processing", description: "Preparing your items", timestamp: "Dec 10, 4:15 PM" },
      { label: "Shipped", description: "On the way to you", timestamp: "Dec 11, 9:00 AM" },
      { label: "Delivered", description: "Package delivered" },
    ],
  },
});
