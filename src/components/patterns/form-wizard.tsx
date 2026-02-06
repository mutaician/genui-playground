"use client";

import { useState } from "react";
import { z } from "zod";
import { registerPattern } from "@/lib/pattern-registry";

export const formWizardSchema = z.object({
  title: z.string().optional().describe("Form title"),
  steps: z.array(z.object({
    title: z.string(),
    fields: z.array(z.object({
      name: z.string(),
      label: z.string(),
      type: z.enum(["text", "email", "select", "date", "number"]),
      placeholder: z.string().optional(),
      options: z.array(z.string()).optional(),
    })),
  })).optional().describe("Form steps with fields"),
});

export type FormWizardProps = z.infer<typeof formWizardSchema>;

export function FormWizard({
  title = "Book Your Trip",
  steps = [
    {
      title: "Destination",
      fields: [
        { name: "from", label: "From", type: "text" as const, placeholder: "Departure city" },
        { name: "to", label: "To", type: "text" as const, placeholder: "Destination city" },
      ],
    },
    {
      title: "Travel Dates",
      fields: [
        { name: "departure", label: "Departure", type: "date" as const },
        { name: "return", label: "Return", type: "date" as const },
      ],
    },
    {
      title: "Travelers",
      fields: [
        { name: "adults", label: "Adults", type: "number" as const, placeholder: "1" },
        { name: "class", label: "Class", type: "select" as const, options: ["Economy", "Business", "First Class"] },
      ],
    },
  ],
}: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = steps?.length || 0;

  return (
    <div className="form-wizard p-5 rounded-xl bg-gray-800 border border-gray-700/50 max-w-md">
      {/* Header */}
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="flex items-center gap-2 mt-3">
          {steps?.map((_, i) => (
            <div 
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                i <= currentStep ? "bg-blue-500" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Step {currentStep + 1} of {totalSteps}: {steps?.[currentStep]?.title}
        </p>
      </div>

      {/* Current Step Fields */}
      <div className="space-y-4">
        {steps?.[currentStep]?.fields.map((field, i) => (
          <div key={i}>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              {field.label}
            </label>
            {field.type === "select" ? (
              <select className="w-full px-3 py-2.5 text-sm text-white bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Select {field.label.toLowerCase()}</option>
                {field.options?.map((opt, j) => (
                  <option key={j} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-3 py-2.5 text-sm text-white bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {currentStep > 0 && (
          <button 
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            Back
          </button>
        )}
        <button 
          onClick={() => currentStep < totalSteps - 1 && setCurrentStep(currentStep + 1)}
          className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
        >
          {currentStep === totalSteps - 1 ? "Complete" : "Continue"}
        </button>
      </div>
    </div>
  );
}

export const formWizardSourceCode = `interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "select" | "date" | "number";
  placeholder?: string;
  options?: string[];
}

interface FormStep {
  title: string;
  fields: FormField[];
}

interface FormWizardProps {
  title: string;
  steps: FormStep[];
  onComplete?: (data: Record<string, string>) => void;
}

export function FormWizard({ title, steps, onComplete }: FormWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(formData);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-gray-800 border border-gray-700/50 max-w-md">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      
      {/* Progress bar */}
      <div className="flex gap-2 mt-3">
        {steps.map((_, i) => (
          <div key={i} className={\`flex-1 h-1.5 rounded-full \${
            i <= currentStep ? "bg-blue-500" : "bg-gray-700"
          }\`} />
        ))}
      </div>

      {/* Form fields */}
      <div className="space-y-4 mt-5">
        {steps[currentStep].fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm text-gray-300 mb-1.5">{field.label}</label>
            {field.type === "select" ? (
              <select onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}>
                {field.options?.map((opt) => <option key={opt}>{opt}</option>)}
              </select>
            ) : (
              <input type={field.type} placeholder={field.placeholder} />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {currentStep > 0 && (
          <button onClick={() => setCurrentStep(currentStep - 1)}>Back</button>
        )}
        <button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Complete" : "Continue"}
        </button>
      </div>
    </div>
  );
}`;

registerPattern({
  id: "form-wizard",
  name: "Form Wizard",
  category: "form",
  domains: ["booking", "onboarding", "checkout", "registration", "travel", "surveys"],
  description: "Multi-step form with progress indicator and field validation",
  component: FormWizard,
  sourceCode: formWizardSourceCode,
  propsSchema: formWizardSchema,
  defaultProps: {
    title: "Book Your Trip",
    steps: [
      {
        title: "Destination",
        fields: [
          { name: "from", label: "From", type: "text", placeholder: "Departure city" },
          { name: "to", label: "To", type: "text", placeholder: "Destination city" },
        ],
      },
      {
        title: "Travel Dates",
        fields: [
          { name: "departure", label: "Departure", type: "date" },
          { name: "return", label: "Return", type: "date" },
        ],
      },
      {
        title: "Travelers",
        fields: [
          { name: "adults", label: "Adults", type: "number", placeholder: "1" },
          { name: "class", label: "Class", type: "select", options: ["Economy", "Business", "First Class"] },
        ],
      },
    ],
  },
});
