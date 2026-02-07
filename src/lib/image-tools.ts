/**
 * @file image-tools.ts
 * @description Tambo tool for image generation using Gemini API + GCS storage
 */

import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * Tool to generate an image using Gemini API
 * Images are stored in GCS and a short public URL is returned
 */
export const generateImageTool: TamboTool = {
  name: "generateImage",
  description: `Generate an image using AI based on a text description.
Use this when the user's component needs an image, such as:
- Product images for e-commerce cards
- Destination photos for travel apps
- User avatars or profile pictures
- Icons or illustrations
- Background images

Returns a short public URL to the generated image.`,
  tool: async ({ prompt }: { prompt: string }): Promise<{ imageUrl: string; success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        return {
          success: true,
          imageUrl: data.imageUrl,
        };
      }

      return {
        success: false,
        imageUrl: "",
        error: data.error || data.message || "Image generation failed",
      };
    } catch (error) {
      return {
        success: false,
        imageUrl: "",
        error: String(error),
      };
    }
  },
  inputSchema: z.object({
    prompt: z.string().describe("A detailed description of the image to generate. Be specific about style, colors, and subject matter."),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    imageUrl: z.string().describe("Public URL to the generated image"),
    error: z.string().optional(),
  }),
};

/**
 * All image-related tools
 */
export const imageTools: TamboTool[] = [generateImageTool];
