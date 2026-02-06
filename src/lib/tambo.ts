/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { Graph, graphSchema } from "@/components/tambo/graph";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import {
  getCountryPopulations,
  getGlobalPopulationTrend,
} from "@/services/population-stats";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

// GenUI Playground components
import { PatternCard, patternCardSchema } from "@/components/genui/PatternCard";
import { PatternGallery, patternGallerySchema } from "@/components/genui/PatternGallery";

// Import patterns to trigger self-registration
import "@/components/patterns";

// Import pattern registry tools
import { getAllPatterns, getPatternsByDomain, getPatternsByCategory, patternCategorySchema } from "@/lib/pattern-registry";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  {
    name: "countryPopulation",
    description:
      "A tool to get population statistics by country with advanced filtering options",
    tool: getCountryPopulations,
    inputSchema: z.object({
      continent: z.string().optional(),
      sortBy: z.enum(["population", "growthRate"]).optional(),
      limit: z.number().optional(),
      order: z.enum(["asc", "desc"]).optional(),
    }),
    outputSchema: z.array(
      z.object({
        countryCode: z.string(),
        countryName: z.string(),
        continent: z.enum([
          "Asia",
          "Africa",
          "Europe",
          "North America",
          "South America",
          "Oceania",
        ]),
        population: z.number(),
        year: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  {
    name: "globalPopulation",
    description:
      "A tool to get global population trends with optional year range filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(
      z.object({
        year: z.number(),
        population: z.number(),
        growthRate: z.number(),
      }),
    ),
  },
  // GenUI Playground tools
  {
    name: "getAvailablePatterns",
    description: "Get all available UI patterns. Use this to see what patterns can be shown to the user.",
    tool: async () => {
      const patterns = getAllPatterns();
      return patterns.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        domains: p.domains,
        description: p.description,
      }));
    },
    inputSchema: z.object({}),
    outputSchema: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      domains: z.array(z.string()),
      description: z.string(),
    })),
  },
  {
    name: "searchPatternsByDomain",
    description: "Search for UI patterns that match a specific domain (e.g., 'travel', 'e-commerce', 'analytics'). Returns patterns suited for that type of application.",
    tool: async ({ domain }: { domain: string }) => {
      const patterns = getPatternsByDomain(domain);
      return patterns.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category,
        description: p.description,
      }));
    },
    inputSchema: z.object({
      domain: z.string().describe("The domain to search for (e.g., 'travel', 'e-commerce', 'dashboard')"),
    }),
    outputSchema: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      description: z.string(),
    })),
  },
  {
    name: "searchPatternsByCategory",
    description: "Get UI patterns by category type: visualization (charts, metrics), form (inputs, wizards), card (info displays), action (confirmations), or status (progress trackers).",
    tool: async ({ category }: { category: string }) => {
      const patterns = getPatternsByCategory(category as "visualization" | "form" | "card" | "action" | "status");
      return patterns.map(p => ({
        id: p.id,
        name: p.name,
        domains: p.domains,
        description: p.description,
      }));
    },
    inputSchema: z.object({
      category: patternCategorySchema.describe("Pattern category to filter by"),
    }),
    outputSchema: z.array(z.object({
      id: z.string(),
      name: z.string(),
      domains: z.array(z.string()),
      description: z.string(),
    })),
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "A component that renders various types of charts (bar, line, pie) using Recharts. Supports customizable data visualization with labels, datasets, and styling options.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCard",
    description:
      "A component that displays options as clickable cards with links and summaries with the ability to select multiple items.",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  // GenUI Playground components
  {
    name: "PatternCard",
    description: "Shows a single generative UI pattern with a live interactive demo and copyable source code. Use when showcasing ONE specific UI pattern. The patternId must be one of: 'metric-card', 'info-card', 'action-confirm', 'status-tracker', 'comparison-table', 'form-wizard'. Provide custom mockData tailored to the user's domain for a personalized demo.",
    component: PatternCard,
    propsSchema: patternCardSchema,
  },
  {
    name: "PatternGallery",
    description: "Shows multiple UI patterns in a gallery layout. Use when suggesting SEVERAL patterns that might work for the user's use case. Each pattern in the array needs a patternId and optional mockData. Perfect for answering 'what generative UI should I add to my chatbot' type questions.",
    component: PatternGallery,
    propsSchema: patternGallerySchema,
  },
];
