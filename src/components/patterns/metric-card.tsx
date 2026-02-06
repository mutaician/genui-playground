"use client";

import { z } from "zod";
import { registerPattern } from "@/lib/pattern-registry";

export const metricCardSchema = z.object({
  title: z.string().optional().describe("Title of the metric"),
  value: z.string().optional().describe("Main value to display"),
  change: z.number().optional().describe("Percentage change"),
  trend: z.enum(["up", "down", "neutral"]).optional().describe("Trend direction"),
  icon: z.string().optional().describe("Icon name or emoji"),
  subtitle: z.string().optional().describe("Additional context"),
});

export type MetricCardProps = z.infer<typeof metricCardSchema>;

export function MetricCard({
  title = "Total Revenue",
  value = "$12,450",
  change = 12.5,
  trend = "up",
  icon = "📈",
  subtitle = "vs last month",
}: MetricCardProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  return (
    <div className="metric-card p-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-sm font-medium ${trendColors[trend || "neutral"]}`}>
              {trendIcons[trend || "neutral"]} {Math.abs(change || 0)}%
            </span>
            <span className="text-xs text-gray-500">{subtitle}</span>
          </div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

// Source code for export
export const metricCardSourceCode = `interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon?: string;
  subtitle?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  icon = "📈",
  subtitle = "vs last period",
}: MetricCardProps) {
  const trendColors = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  return (
    <div className="p-5 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={\`text-sm font-medium \${trendColors[trend]}\`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {Math.abs(change)}%
            </span>
            <span className="text-xs text-gray-500">{subtitle}</span>
          </div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}`;

// Register the pattern
registerPattern({
  id: "metric-card",
  name: "Metric Card",
  category: "visualization",
  domains: ["analytics", "dashboard", "finance", "e-commerce", "saas", "admin"],
  description: "Displays a single metric with trend indicator and change percentage",
  component: MetricCard,
  sourceCode: metricCardSourceCode,
  propsSchema: metricCardSchema,
  defaultProps: {
    title: "Total Revenue",
    value: "$12,450",
    change: 12.5,
    trend: "up",
    icon: "📈",
    subtitle: "vs last month",
  },
});
