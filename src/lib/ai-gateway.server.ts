import { createOpenAI } from "@ai-sdk/openai";

/**
 * Server-only Lovable AI Gateway provider (OpenAI Responses API).
 */
export function createLovableGateway(lovableApiKey: string) {
  return createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey: lovableApiKey,
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });
}
