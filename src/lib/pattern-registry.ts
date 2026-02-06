/**
 * Pattern Registry
 * Central registry of all UI pattern templates with metadata
 */

import { z } from "zod";
import { ComponentType } from "react";

export type PatternCategory = 
  | "visualization" 
  | "form" 
  | "card" 
  | "action" 
  | "status";

export interface PatternTemplate {
  id: string;
  name: string;
  category: PatternCategory;
  domains: string[];
  description: string;
  component: ComponentType<Record<string, unknown>>;
  sourceCode: string;
  propsSchema: z.ZodObject<z.ZodRawShape>;
  defaultProps: Record<string, unknown>;
}

// Pattern registry - will be populated by pattern files
const patterns: Map<string, PatternTemplate> = new Map();

export function registerPattern(pattern: PatternTemplate): void {
  patterns.set(pattern.id, pattern);
}

export function getPattern(id: string): PatternTemplate | undefined {
  return patterns.get(id);
}

export function getAllPatterns(): PatternTemplate[] {
  return Array.from(patterns.values());
}

export function getPatternsByCategory(category: PatternCategory): PatternTemplate[] {
  return getAllPatterns().filter((p) => p.category === category);
}

export function getPatternsByDomain(domain: string): PatternTemplate[] {
  const domainLower = domain.toLowerCase();
  return getAllPatterns().filter((p) => 
    p.domains.some((d) => 
      d.toLowerCase().includes(domainLower) || 
      domainLower.includes(d.toLowerCase())
    )
  );
}

export function searchPatterns(query: string): PatternTemplate[] {
  const queryLower = query.toLowerCase();
  return getAllPatterns().filter((p) => 
    p.name.toLowerCase().includes(queryLower) ||
    p.description.toLowerCase().includes(queryLower) ||
    p.domains.some((d) => d.toLowerCase().includes(queryLower)) ||
    p.category.toLowerCase().includes(queryLower)
  );
}

// Export for Zod schema generation
export const patternCategorySchema = z.enum([
  "visualization",
  "form", 
  "card",
  "action",
  "status",
]);
