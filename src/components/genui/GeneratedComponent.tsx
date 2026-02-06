"use client";

import { useState } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { z } from "zod";
import { CodePreview } from "./CodePreview";

export const generatedComponentSchema = z.object({
  name: z.string().describe("Name of the generated component"),
  description: z.string().describe("Brief description of what this component does and why it's suitable for the user's use case"),
  code: z.string().describe("Complete React functional component code. Must be a self-contained component that renders JSX. Use inline Tailwind CSS classes for styling. The component should be the default export or assigned to 'render'. Example: 'function MyComponent() { return <div className=\"p-4 bg-gray-800 rounded-lg\">Hello</div> }; render(<MyComponent />);'"),
  category: z.string().optional().describe("Category of UI pattern: visualization, form, card, action, status, navigation, etc."),
});

export type GeneratedComponentProps = z.infer<typeof generatedComponentSchema>;

// Scope available to the generated code
const scope = {
  // React is implicitly available in react-live
};

export function GeneratedComponent({
  name,
  description,
  code,
  category,
}: GeneratedComponentProps) {
  const [showCode, setShowCode] = useState(false);

  // Wrap the code to make it renderable
  const executableCode = code?.includes("render(") 
    ? code 
    : `${code}\n\nrender(<${extractComponentName(code) || "Component"} />);`;

  return (
    <div className="generated-component rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/50 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{name || "Generated Component"}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          </div>
          {category && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 capitalize">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Live Preview */}
      <div className="p-5 bg-gray-900/50">
        <LiveProvider code={executableCode} scope={scope} noInline>
          <div className="demo-container p-4 rounded-lg bg-white/5 border border-gray-700/30 min-h-[100px]">
            <LivePreview />
          </div>
          <LiveError className="mt-3 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg" />
        </LiveProvider>
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
        
        {showCode && code && (
          <div className="px-5 pb-5">
            <CodePreview 
              code={code} 
              title={`${name || "Component"}.tsx`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to extract component name from code
function extractComponentName(code: string): string | null {
  if (!code) return null;
  
  // Try to match "function ComponentName" or "const ComponentName"
  const funcMatch = code.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
  if (funcMatch) return funcMatch[1];
  
  const constMatch = code.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=/);
  if (constMatch) return constMatch[1];
  
  return null;
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
