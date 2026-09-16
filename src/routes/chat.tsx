import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { chatAssistant } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Assistant Chat — Workplace AI" },
      {
        name: "description",
        content: "Chat with an AI assistant about your work: drafting, planning, prioritizing and problem solving.",
      },
      { property: "og:title", content: "AI Assistant Chat" },
      { property: "og:description", content: "A conversational assistant for everyday work questions." },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const suggestions = [
  "Help me prioritize my week",
  "Rewrite this update to be more concise",
  "What should I ask in a vendor review?",
];

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const send = useServerFn(chatAssistant);
  const mutation = useMutation({
    mutationFn: (next: Message[]) => send({ data: { messages: next } }),
    onSuccess: (result) =>
      setMessages((m) => [...m, { role: "assistant", content: result.text }]),
    onError: (error: Error) => toast.error(error.message || "The assistant could not reply."),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const submit = (text: string) => {
    const content = text.trim();
    if (!content || mutation.isPending) return;
    const next: Message[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Bot className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">AI Assistant Chat</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask follow-up questions and work through a task conversationally.
            </p>
          </div>
        </header>

        <Card className="flex h-[60vh] min-h-[420px] flex-col gap-0 overflow-hidden p-0">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Start a conversation — try one of these:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((s) => (
                    <Button key={s} variant="outline" size="sm" onClick={() => submit(s)}>
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Bot className="size-4" />
                  </span>
                )}
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <User className="size-4" />
                  </span>
                )}
              </div>
            ))}

            {mutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Thinking…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-3 sm:p-4">
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                rows={2}
                placeholder="Ask anything about your work…"
                className="min-h-[52px] resize-none"
                aria-label="Message"
              />
              <Button
                size="icon"
                className="size-11 shrink-0"
                aria-label="Send message"
                disabled={mutation.isPending || !input.trim()}
                onClick={() => submit(input)}
              >
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </Card>

        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
