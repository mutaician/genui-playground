import { NextRequest, NextResponse } from "next/server";

// In-memory image store (for demo purposes)
// In production, use Redis, S3, or database
const imageStore = new Map<string, { data: string; mimeType: string; createdAt: number }>();

// Clean up old images (older than 10 minutes)
function cleanupOldImages() {
  const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
  for (const [id, image] of imageStore) {
    if (image.createdAt < tenMinutesAgo) {
      imageStore.delete(id);
    }
  }
}

/**
 * POST /api/generate-image
 * Generate an image using Gemini's image generation API
 * Returns a short imageId instead of the full base64 to avoid context overflow
 */
export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    // Use Gemini 2.5 Flash Image model (Nano Banana)
    // Model name from docs: https://ai.google.dev/gemini-api/docs/image-generation
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseModalities: ["IMAGE", "TEXT"],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Image generation failed", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the image from the response
    const parts = data.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType || "image/png";
        const base64Data = part.inlineData.data;
        
        // Generate a short ID and store the image
        const imageId = `img_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
        
        // Cleanup old images first
        cleanupOldImages();
        
        // Store the image
        imageStore.set(imageId, {
          data: base64Data,
          mimeType,
          createdAt: Date.now(),
        });
        
        // Return just the short imageId - NOT the huge base64!
        return NextResponse.json({
          success: true,
          imageId,
          // Provide a URL the component can use to fetch the image
          imageUrl: `/api/generate-image?id=${imageId}`,
        });
      }
    }

    // If no image was generated, return any text response
    const textPart = parts.find((p: { text?: string }) => p.text);
    return NextResponse.json({
      success: false,
      error: "No image generated",
      message: textPart?.text || "Unknown error",
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate-image?id=xxx
 * Retrieve a stored image by its ID
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("id");

  if (!imageId) {
    return NextResponse.json({ error: "Image ID required" }, { status: 400 });
  }

  const image = imageStore.get(imageId);
  if (!image) {
    return NextResponse.json({ error: "Image not found or expired" }, { status: 404 });
  }

  // Return the image as binary
  const buffer = Buffer.from(image.data, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=600",
    },
  });
}
