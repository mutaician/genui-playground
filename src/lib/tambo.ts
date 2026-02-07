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
    description: `Generate ONE small React component demo (MAX 30 lines of code).

IMPORTANT - LIGHT MODE BY DEFAULT:
- Background: bg-white or bg-gray-50
- Text: text-gray-900, text-gray-600 for secondary
- Borders: border-gray-200
- Accents: Use teal-500/cyan-500 for highlights

ONLY use dark mode (bg-gray-800, text-white) if user explicitly asks.

CRITICAL RULES:
- MAXIMUM 42 lines of code total
- ONE focused component only
- Use Tailwind CSS
- End with: render(<ComponentName />);
- Include 2-3 mock data items max

Example (documentation search result - LIGHT theme):
function DocResult() {
  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-gray-900 font-medium">Getting Started</h3>
      <p className="text-gray-600 text-sm mt-1">Quick setup guide for new users...</p>
      <span className="text-xs text-teal-600 font-medium">95% match</span>
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
