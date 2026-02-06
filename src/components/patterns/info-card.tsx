"use client";

import { z } from "zod";
import { registerPattern } from "@/lib/pattern-registry";

export const infoCardSchema = z.object({
  title: z.string().optional().describe("Card title"),
  description: z.string().optional().describe("Card description"),
  image: z.string().optional().describe("Image URL"),
  badge: z.string().optional().describe("Badge text"),
  metadata: z.array(z.object({
    label: z.string(),
    value: z.string(),
  })).optional().describe("Key-value metadata"),
  actionLabel: z.string().optional().describe("CTA button text"),
});

export type InfoCardProps = z.infer<typeof infoCardSchema>;

export function InfoCard({
  title = "Tropical Paradise Resort",
  description = "Experience luxury beachfront living with stunning ocean views and world-class amenities.",
  image = "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
  badge = "Featured",
  metadata = [
    { label: "Location", value: "Maldives" },
    { label: "Rating", value: "4.9 ★" },
    { label: "Price", value: "$299/night" },
  ],
  actionLabel = "View Details",
}: InfoCardProps) {
  return (
    <div className="info-card rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 max-w-sm">
      {/* Image */}
      <div className="relative h-44 bg-gray-700">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500 text-black">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</p>

        {/* Metadata */}
        {metadata && metadata.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {metadata.map((item, i) => (
              <div key={i} className="text-xs">
                <span className="text-gray-500">{item.label}: </span>
                <span className="text-gray-300 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action */}
        <button className="w-full mt-4 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export const infoCardSourceCode = `interface InfoCardProps {
  title: string;
  description: string;
  image: string;
  badge?: string;
  metadata?: { label: string; value: string }[];
  actionLabel?: string;
}

export function InfoCard({
  title,
  description,
  image,
  badge,
  metadata = [],
  actionLabel = "View Details",
}: InfoCardProps) {
  return (
    <div className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700/50 max-w-sm">
      {/* Image */}
      <div className="relative h-44 bg-gray-700">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        {badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500 text-black">
            {badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-3 mt-3">
          {metadata.map((item, i) => (
            <div key={i} className="text-xs">
              <span className="text-gray-500">{item.label}: </span>
              <span className="text-gray-300 font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Action */}
        <button className="w-full mt-4 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}`;

registerPattern({
  id: "info-card",
  name: "Info Card",
  category: "card",
  domains: ["travel", "e-commerce", "products", "real-estate", "hospitality", "listings"],
  description: "Rich preview card with image, metadata, and call-to-action",
  component: InfoCard,
  sourceCode: infoCardSourceCode,
  propsSchema: infoCardSchema,
  defaultProps: {
    title: "Tropical Paradise Resort",
    description: "Experience luxury beachfront living with stunning ocean views and world-class amenities.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
    badge: "Featured",
    metadata: [
      { label: "Location", value: "Maldives" },
      { label: "Rating", value: "4.9 ★" },
      { label: "Price", value: "$299/night" },
    ],
    actionLabel: "View Details",
  },
});
