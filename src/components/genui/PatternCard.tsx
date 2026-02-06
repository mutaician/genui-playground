"use client";

import { useState } from "react";
import { z } from "zod";
import { CodePreview } from "./CodePreview";
import { getPattern } from "@/lib/pattern-registry";

export const patternCardSchema = z.object({
  patternId: z.string().describe("The ID of the pattern to display. Must be one of: 'metric-card', 'info-card', 'action-confirm', 'status-tracker', 'comparison-table', 'form-wizard'"),
  mockDataJson: z.string().optional().describe("Optional JSON string with custom mock data props for the demo, tailored to user's domain"),
  explanation: z.string().optional().describe("Why this pattern fits the user's use case"),
  expanded: z.boolean().optional().describe("Whether to show code by default"),
});

export type PatternCardProps = z.infer<typeof patternCardSchema>;

export function PatternCard({
  patternId,
  mockDataJson,
  explanation,
  expanded = false,
}: PatternCardProps) {
  const [showCode, setShowCode] = useState(expanded);
  const pattern = getPattern(patternId);

  if (!pattern) {
    return (
      <div className="pattern-card p-6 rounded-xl border border-red-500/30 bg-red-500/10">
        <p className="text-red-400">Pattern "{patternId}" not found</p>
      </div>
    );
  }

  const Component = pattern.component;
  // Parse mockDataJson if provided, otherwise use default props
  let props = pattern.defaultProps;
  if (mockDataJson) {
    try {
      props = JSON.parse(mockDataJson);
    } catch {
      // Fall back to defaults if JSON is invalid
    }
  }

  return (
    <div className="pattern-card rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/50 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{pattern.name}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{pattern.description}</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 capitalize">
            {pattern.category}
          </span>
        </div>
        {explanation && (
          <p className="mt-3 text-sm text-emerald-400/90 italic">
            💡 {explanation}
          </p>
        )}
      </div>

      {/* Demo Area */}
      <div className="p-5 bg-gray-900/50">
        <div className="demo-container p-4 rounded-lg bg-white/5 border border-gray-700/30">
          <Component {...props} />
        </div>
      </div>

      {/* Code Toggle & Preview */}
      <div className="border-t border-gray-700/50">
        <button
          onClick={() => setShowCode(!showCode)}
          className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <CodeIcon className="w-4 h-4" />
            {showCode ? "Hide Code" : "View Code"}
          </span>
          <ChevronIcon className={`w-4 h-4 transition-transform ${showCode ? "rotate-180" : ""}`} />
        </button>
        
        {showCode && (
          <div className="px-5 pb-5">
            <CodePreview 
              code={pattern.sourceCode} 
              title={`${pattern.name}.tsx`}
            />
          </div>
        )}
      </div>
    </div>
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
