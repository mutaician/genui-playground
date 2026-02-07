"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ChatContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt") || undefined;
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
    >
      <div className="h-screen">
        <MessageThreadFull className="max-w-4xl mx-auto" initialPrompt={initialPrompt} />
      </div>
    </TamboProvider>
  );
}

/**
 * Chat page with support for initial prompt via URL query param.
 * Usage: /chat?prompt=Your%20prompt%20here
 */
export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-gray-400">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}

