"use client";

import { z } from "zod";
import { PatternCard } from "./PatternCard";

export const patternGallerySchema = z.object({
  patterns: z.array(
    z.object({
      patternId: z.string().describe("The ID of the pattern. Must be one of: 'metric-card', 'info-card', 'action-confirm', 'status-tracker', 'comparison-table', 'form-wizard'"),
      mockDataJson: z.string().optional().describe("Optional JSON string with custom mock data for this pattern"),
      relevance: z.string().optional().describe("Why this pattern is relevant for the user's use case"),
    })
  ).describe("Array of patterns to display"),
  title: z.string().optional().describe("Optional title for the gallery"),
  description: z.string().optional().describe("Optional description of the patterns"),
});

export type PatternGalleryProps = z.infer<typeof patternGallerySchema>;

export function PatternGallery({
  patterns,
  title,
  description,
}: PatternGalleryProps) {
  if (!patterns || patterns.length === 0) {
    return (
      <div className="pattern-gallery p-6 rounded-xl border border-gray-700/50 bg-gray-800/30">
        <p className="text-gray-400">No patterns to display</p>
      </div>
    );
  }

  return (
    <div className="pattern-gallery">
      {/* Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-400">{description}</p>
          )}
        </div>
      )}

      {/* Pattern Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {patterns.map((pattern, index) => (
          <PatternCard
            key={`${pattern.patternId}-${index}`}
            patternId={pattern.patternId}
            mockDataJson={pattern.mockDataJson}
            explanation={pattern.relevance}
          />
        ))}
      </div>
    </div>
  );
}
