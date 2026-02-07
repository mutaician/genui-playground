import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

// Initialize GCS client
function getStorageClient(): Storage {
  const credentials = process.env.GCS_CREDENTIALS;
  if (!credentials) {
    throw new Error("GCS_CREDENTIALS not configured");
  }
  
  return new Storage({
    credentials: JSON.parse(credentials),
  });
}

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || "genui-images-gen-lang-client-0764692608";

/**
 * POST /api/generate-image
 * Generate an image using Gemini API and upload to GCS
 * Returns a short public URL
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

    // Generate image using Gemini 3 Pro Image model
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
    const parts = data.candidates?.[0]?.content?.parts || [];
    
    for (const part of parts) {
      if (part.inlineData) {
        const mimeType = part.inlineData.mimeType || "image/png";
        const base64Data = part.inlineData.data;
        
        // Generate unique filename
        const extension = mimeType.split("/")[1] || "png";
        const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;
        
        // Upload to GCS
        const storage = getStorageClient();
        const bucket = storage.bucket(BUCKET_NAME);
        const file = bucket.file(filename);
        
        const buffer = Buffer.from(base64Data, "base64");
        await file.save(buffer, {
          contentType: mimeType,
          metadata: {
            cacheControl: "public, max-age=31536000",
          },
        });
        
        // Return the public URL
        const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
        
        return NextResponse.json({
          success: true,
          imageUrl: publicUrl,
        });
      }
    }

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
