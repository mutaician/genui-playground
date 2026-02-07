"use client";

import { useState, useEffect } from "react";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import { z } from "zod";
import { useTamboComponentState } from "@tambo-ai/react";
import { CodePreview } from "./CodePreview";

// Customization schema for tweakable properties
const customizationSchema = z.object({
  primaryColor: z.string().optional().describe("Primary accent color (hex code like #0d9488)"),
  secondaryColor: z.string().optional().describe("Secondary color (hex code)"),
  layout: z.enum(["compact", "detailed", "minimal"]).optional().describe("Layout style"),
  fontSize: z.enum(["sm", "base", "lg"]).optional().describe("Base font size"),
  rounded: z.enum(["none", "sm", "md", "lg", "full"]).optional().describe("Border radius style"),
});

export const interactiveComponentSchema = z.object({
  name: z.string().describe("Name of the generated component"),
  description: z.string().describe("Brief description of what this component does"),
  code: z.string().describe(`Complete React functional component code. 
IMPORTANT: Access customization via the 'config' object in scope:
- config.primaryColor (hex string)
- config.secondaryColor (hex string) 
- config.layout ('compact' | 'detailed' | 'minimal')
- config.fontSize ('sm' | 'base' | 'lg')
- config.rounded ('none' | 'sm' | 'md' | 'lg' | 'full')

Example:
function Card() {
  return (
    <div style={{ borderColor: config.primaryColor }} className="border-2 p-4 rounded-lg">
      <h3 style={{ color: config.primaryColor }}>Hello</h3>
    </div>
  );
}
render(<Card />);`),
  category: z.string().optional().describe("Category: card, form, visualization, action, status"),
  customization: customizationSchema.optional().describe("Initial customization values"),
});

export type InteractiveComponentProps = z.infer<typeof interactiveComponentSchema>;

// Preset color swatches
const COLOR_PRESETS = [
  { name: "Teal", value: "#0d9488" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Green", value: "#22c55e" },
  { name: "Red", value: "#ef4444" },
  { name: "Gray", value: "#6b7280" },
];

const LAYOUT_OPTIONS = ["compact", "detailed", "minimal"] as const;
const FONT_SIZE_OPTIONS = ["sm", "base", "lg"] as const;
const ROUNDED_OPTIONS = ["none", "sm", "md", "lg", "full"] as const;

export function InteractiveGeneratedComponent({
  name,
  description,
  code,
  category,
  customization,
}: InteractiveComponentProps) {
  // Use Tambo component state for AI-controllable customization
  const [primaryColor, setPrimaryColor] = useTamboComponentState(
    "primaryColor",
    customization?.primaryColor || "#0d9488",
    customization?.primaryColor
  );
  const [secondaryColor, setSecondaryColor] = useTamboComponentState(
    "secondaryColor",
    customization?.secondaryColor || "#6b7280",
    customization?.secondaryColor
  );
  const [layout, setLayout] = useTamboComponentState(
    "layout",
    customization?.layout || "detailed",
    customization?.layout
  );
  const [fontSize, setFontSize] = useTamboComponentState(
    "fontSize",
    customization?.fontSize || "base",
    customization?.fontSize
  );
  const [rounded, setRounded] = useTamboComponentState(
    "rounded",
    customization?.rounded || "md",
    customization?.rounded
  );

  const [showCode, setShowCode] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Build the config object injected into scope
  const config = {
    primaryColor,
    secondaryColor,
    layout,
    fontSize,
    rounded,
  };

  // Create scope with config object for react-live
  const scope = { config };

  // Wrap the code to make it renderable
  const executableCode = code?.includes("render(")
    ? code
    : `${code}\n\nrender(<${extractComponentName(code) || "Component"} />);`;

  return (
    <div className="interactive-component rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-900/80 to-gray-800/50 overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-700/50 bg-gray-800/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{name || "Interactive Component"}</h3>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-teal-500/20 text-teal-300">
                Interactive
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          </div>
          {category && (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 capitalize">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Customization Controls */}
      <div className="border-b border-gray-700/50">
        <button
          onClick={() => setShowControls(!showControls)}
          className="w-full px-5 py-3 flex items-center justify-between text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <SettingsIcon className="w-4 h-4" />
            Customize
          </span>
          <ChevronIcon className={`w-4 h-4 transition-transform ${showControls ? "rotate-180" : ""}`} />
        </button>

        {showControls && (
          <div className="px-5 pb-4 space-y-4">
            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Primary Color</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setPrimaryColor(color.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        primaryColor === color.value ? "border-white scale-110" : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Secondary Color</label>
                <div className="flex flex-wrap gap-1.5">
                  {COLOR_PRESETS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSecondaryColor(color.value)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        secondaryColor === color.value ? "border-white scale-110" : "border-transparent hover:scale-105"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Layout Toggle */}
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Layout</label>
              <div className="flex gap-1">
                {LAYOUT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setLayout(opt)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                      layout === opt
                        ? "bg-teal-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size & Rounded */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Font Size</label>
                <div className="flex gap-1">
                  {FONT_SIZE_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFontSize(opt)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors uppercase ${
                        fontSize === opt
                          ? "bg-teal-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">Corners</label>
                <div className="flex gap-1">
                  {ROUNDED_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setRounded(opt)}
                      className={`px-2 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                        rounded === opt
                          ? "bg-teal-500 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {opt === "none" ? "□" : opt === "full" ? "●" : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
            {/* Show current config */}
            <div className="mt-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700/30">
              <p className="text-xs text-gray-400 mb-2">Current config values:</p>
              <pre className="text-xs text-teal-400 font-mono">
{`const config = ${JSON.stringify(config, null, 2)};`}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to extract component name from code
function extractComponentName(code: string): string | null {
  if (!code) return null;
  const funcMatch = code.match(/function\s+([A-Z][a-zA-Z0-9]*)/);
  if (funcMatch) return funcMatch[1];
  const constMatch = code.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=/);
  if (constMatch) return constMatch[1];
  return null;
}

// Icons
function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
