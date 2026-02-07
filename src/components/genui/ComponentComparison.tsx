"use client";

import { useState } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { z } from "zod";
import { CodePreview } from "./CodePreview";

// Schema for a single component variation
const componentVariationSchema = z.object({
  name: z.string().describe("Name/title for this variation (e.g., 'Minimal', 'Detailed', 'Compact')"),
  description: z.string().describe("Brief explanation of this variation's approach"),
  code: z.string().describe("Complete React component code ending with render(<ComponentName />);"),
});

export const componentComparisonSchema = z.object({
  title: z.string().describe("Overall title for the comparison (e.g., 'Documentation Search UI Options')"),
  context: z.string().describe("Brief context about the user's use case and what these variations address"),
  variations: z
    .array(componentVariationSchema)
    .min(2)
    .max(3)
    .describe("2-3 different UI approaches for the same use case. Each should have distinct visual style or layout."),
});

export type ComponentComparisonProps = z.infer<typeof componentComparisonSchema>;

export function ComponentComparison({
  title,
  context,
  variations,
}: ComponentComparisonProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showCode, setShowCode] = useState<number | null>(null);

  return (
    <div className="component-comparison">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">{title || "Compare Options"}</h2>
        <p className="text-gray-400 text-sm">{context}</p>
      </div>

      {/* Variations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {variations?.map((variation, index) => (
          <VariationCard
            key={index}
            variation={variation}
            index={index}
            isSelected={selectedIndex === index}
            showCode={showCode === index}
            onSelect={() => setSelectedIndex(selectedIndex === index ? null : index)}
            onToggleCode={() => setShowCode(showCode === index ? null : index)}
          />
        ))}
      </div>

      {/* Selection Summary */}
      {selectedIndex !== null && variations?.[selectedIndex] && (
        <div className="mt-6 p-4 rounded-lg bg-teal-500/10 border border-teal-500/30">
          <div className="flex items-center gap-2 text-teal-400">
            <CheckIcon className="w-5 h-5" />
            <span className="font-medium">Selected: {variations[selectedIndex].name}</span>
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Click "View Code" to see the implementation details.
          </p>
        </div>
      )}
    </div>
  );
}

interface VariationCardProps {
  variation: z.infer<typeof componentVariationSchema>;
  index: number;
  isSelected: boolean;
  showCode: boolean;
  onSelect: () => void;
  onToggleCode: () => void;
}

function VariationCard({
  variation,
  index,
  isSelected,
  showCode,
  onSelect,
  onToggleCode,
}: VariationCardProps) {
  const { name, description, code } = variation;

  // Ensure code ends with render()
  const executableCode = code?.includes("render(")
    ? code
    : `${code}\n\nrender(<Component />);`;

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-all ${
        isSelected
          ? "border-teal-500 ring-2 ring-teal-500/30"
          : "border-gray-700/50 hover:border-gray-600"
      } bg-gradient-to-br from-gray-900/80 to-gray-800/50`}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-gray-300">
              {index + 1}
            </span>
            <h3 className="font-semibold text-white">{name}</h3>
          </div>
          <button
            onClick={onSelect}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              isSelected
                ? "bg-teal-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>

      {/* Live Preview */}
      <div className="p-4 bg-gray-900/50 min-h-[120px]">
        <LiveProvider code={executableCode} scope={{}} noInline>
          <div className="demo-container p-3 rounded-lg bg-white/5 border border-gray-700/30">
            <LivePreview />
          </div>
          <LiveError className="mt-2 p-2 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded" />
        </LiveProvider>
      </div>

      {/* Code Toggle */}
      <div className="border-t border-gray-700/50">
        <button
          onClick={onToggleCode}
          className="w-full px-4 py-2 flex items-center justify-between text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <CodeIcon className="w-3.5 h-3.5" />
            {showCode ? "Hide Code" : "View Code"}
          </span>
          <ChevronIcon className={`w-3.5 h-3.5 transition-transform ${showCode ? "rotate-180" : ""}`} />
        </button>

        {showCode && code && (
          <div className="px-4 pb-4">
            <CodePreview code={code} title={`${name || "Component"}.tsx`} />
          </div>
        )}
      </div>
    </div>
  );
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
