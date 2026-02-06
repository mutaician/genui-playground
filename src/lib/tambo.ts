/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * GenUI Playground - AI generates React components on-the-fly
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

// GenUI Playground - Dynamic Component Generation
import { GeneratedComponent, generatedComponentSchema } from "@/components/genui/GeneratedComponent";

/**
 * tools - empty for now, AI generates components directly
 */
export const tools: TamboTool[] = [];

/**
 * components
 */
export const components: TamboComponent[] = [
  {
    name: "GeneratedComponent",
    description: `Generate ONE small React component demo (MAX 25 lines of code).

CRITICAL RULES:
- MAXIMUM 42 lines of code total
- ONE simple component only
- Use Tailwind CSS (dark theme: bg-gray-800, text-white, border-gray-700)
- End with: render(<ComponentName />);
- Include 2-3 mock data items max

Example (documentation bot):
function DocResult() {
  return (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-white font-medium">Getting Started</h3>
      <p className="text-gray-400 text-sm mt-1">Quick setup guide...</p>
      <span className="text-xs text-green-400">95% match</span>
    </div>
  );
}
render(<DocResult />);`,
    component: GeneratedComponent,
    propsSchema: generatedComponentSchema,
  },
  {
    name: "Graph",
    description: "Renders charts (bar, line, pie) using Recharts.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description: "Displays clickable cards with links and summaries.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
];
