"use client";

import { z } from "zod";
import { registerPattern } from "@/lib/pattern-registry";

export const comparisonTableSchema = z.object({
  title: z.string().optional().describe("Table title"),
  items: z.array(z.object({
    name: z.string(),
    highlight: z.boolean().optional(),
    features: z.record(z.union([z.boolean(), z.string()])),
  })).optional().describe("Items to compare"),
  featureLabels: z.array(z.string()).optional().describe("Feature row labels"),
});

export type ComparisonTableProps = z.infer<typeof comparisonTableSchema>;

export function ComparisonTable({
  title = "Compare Plans",
  items = [
    { name: "Basic", features: { price: "$9/mo", users: "1", storage: "10GB", support: false, api: false } },
    { name: "Pro", highlight: true, features: { price: "$29/mo", users: "5", storage: "100GB", support: true, api: true } },
    { name: "Enterprise", features: { price: "$99/mo", users: "Unlimited", storage: "1TB", support: true, api: true } },
  ],
  featureLabels = ["price", "users", "storage", "support", "api"],
}: ComparisonTableProps) {
  const formatLabel = (key: string) => 
    key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1");

  return (
    <div className="comparison-table rounded-xl bg-gray-800 border border-gray-700/50 overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="px-5 py-3 text-left text-sm font-medium text-gray-400">Feature</th>
              {items?.map((item, i) => (
                <th 
                  key={i} 
                  className={`px-5 py-3 text-center text-sm font-semibold ${
                    item.highlight ? "text-blue-400 bg-blue-500/10" : "text-white"
                  }`}
                >
                  {item.name}
                  {item.highlight && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded">
                      Popular
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureLabels?.map((feature, i) => (
              <tr key={i} className="border-b border-gray-700/30 last:border-0">
                <td className="px-5 py-3 text-sm text-gray-300">{formatLabel(feature)}</td>
                {items?.map((item, j) => {
                  const value = item.features[feature];
                  return (
                    <td 
                      key={j} 
                      className={`px-5 py-3 text-center text-sm ${
                        item.highlight ? "bg-blue-500/5" : ""
                      }`}
                    >
                      {typeof value === "boolean" ? (
                        value ? (
                          <span className="text-emerald-400">✓</span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )
                      ) : (
                        <span className="text-gray-200">{value}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const comparisonTableSourceCode = `interface ComparisonItem {
  name: string;
  highlight?: boolean;
  features: Record<string, boolean | string>;
}

interface ComparisonTableProps {
  title?: string;
  items: ComparisonItem[];
  featureLabels: string[];
}

export function ComparisonTable({ title, items, featureLabels }: ComparisonTableProps) {
  return (
    <div className="rounded-xl bg-gray-800 border border-gray-700/50 overflow-hidden">
      {title && (
        <div className="px-5 py-4 border-b border-gray-700/50">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      )}
      
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="px-5 py-3 text-left text-sm text-gray-400">Feature</th>
            {items.map((item, i) => (
              <th key={i} className={\`px-5 py-3 text-center text-sm font-semibold \${
                item.highlight ? "text-blue-400 bg-blue-500/10" : "text-white"
              }\`}>
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {featureLabels.map((feature, i) => (
            <tr key={i} className="border-b border-gray-700/30">
              <td className="px-5 py-3 text-sm text-gray-300">{feature}</td>
              {items.map((item, j) => (
                <td key={j} className="px-5 py-3 text-center text-sm">
                  {typeof item.features[feature] === "boolean" 
                    ? (item.features[feature] ? "✓" : "—")
                    : item.features[feature]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`;

registerPattern({
  id: "comparison-table",
  name: "Comparison Table",
  category: "visualization",
  domains: ["pricing", "products", "saas", "plans", "features", "comparisons"],
  description: "Side-by-side feature comparison table with highlighting",
  component: ComparisonTable,
  sourceCode: comparisonTableSourceCode,
  propsSchema: comparisonTableSchema,
  defaultProps: {
    title: "Compare Plans",
    items: [
      { name: "Basic", features: { price: "$9/mo", users: "1", storage: "10GB", support: false, api: false } },
      { name: "Pro", highlight: true, features: { price: "$29/mo", users: "5", storage: "100GB", support: true, api: true } },
      { name: "Enterprise", features: { price: "$99/mo", users: "Unlimited", storage: "1TB", support: true, api: true } },
    ],
    featureLabels: ["price", "users", "storage", "support", "api"],
  },
});
