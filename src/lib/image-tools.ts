/**
 * @file image-tools.ts
 * @description Tambo tools for image generation using Gemini API
 */

import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * Tool to generate an image using Gemini's Nano Banana model
 * Returns a data URL that can be used directly in <img> src
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

The tool returns a short imageUrl (like /api/generate-image?id=xxx) that can be used directly in <img src={...}>.
This URL does NOT overwhelm the context - it's just a short path.`,
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
        // Return the SHORT url path, not base64!
        return {
          success: true,
          imageUrl: data.imageUrl, // e.g. "/api/generate-image?id=img_abc123"
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
    imageUrl: z.string().describe("Short URL path to the generated image (e.g. /api/generate-image?id=xxx)"),
    error: z.string().optional(),
  }),
};

/**
 * All image-related tools
 */
export const imageTools: TamboTool[] = [generateImageTool];
