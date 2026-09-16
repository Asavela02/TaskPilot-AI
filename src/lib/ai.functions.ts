import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { createLovableGateway } from "./ai-gateway.server";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
});

const RunInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
});

const ChatInput = z.object({
  messages: z.array(MessageSchema).min(1),
});

async function complete(system: string, messages: { role: "user" | "assistant"; content: string }[]) {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet.");

  const gateway = createLovableGateway(key);

  const result = streamText({
    model: gateway.responses("openai/gpt-6-astra"),
    system,
    messages,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const text = await result.text;
  return text.trim();
}

/** Runs a structured, single-shot workplace prompt. */
export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RunInput.parse(input))
  .handler(async ({ data }) => {
    const text = await complete(data.system, [{ role: "user", content: data.prompt }]);
    return { text: text || "The assistant returned no text. Try adding more detail and run it again." };
  });

/** Multi-turn chat assistant. */
export const chatAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const text = await complete(
      "You are a helpful, concise workplace productivity assistant for professionals. Give practical, well-structured answers using short paragraphs and bullet points where useful. Say clearly when you are unsure.",
      data.messages,
    );
    return { text: text || "I couldn't generate a reply. Please try rephrasing." };
  });
