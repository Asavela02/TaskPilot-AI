import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, ListChecks, Mail, NotebookPen, Search, Sparkles } from "lucide-react";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant — Dashboard" },
      {
        name: "description",
        content:
          "Automate workplace tasks with AI: draft emails, summarize meeting notes, plan tasks, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, summarize meetings, plan tasks and research faster with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    to: "/email",
    title: "Smart Email Generator",
    description: "Turn a few bullet points into a polished, on-tone business email.",
    icon: Mail,
  },
  {
    to: "/notes",
    title: "Meeting Notes Summarizer",
    description: "Condense raw notes into decisions, action items and owners.",
    icon: NotebookPen,
  },
  {
    to: "/planner",
    title: "AI Task Planner",
    description: "Break a goal into a prioritized, time-boxed plan you can execute.",
    icon: ListChecks,
  },
  {
    to: "/research",
    title: "AI Research Assistant",
    description: "Get a structured briefing with key findings, risks and open questions.",
    icon: Search,
  },
  {
    to: "/chat",
    title: "AI Chatbot Interface",
    description: "Ask anything about your work in a natural back-and-forth conversation.",
    icon: Bot,
  },
] as const;

function Dashboard() {
  return (
    <AppShell>
      <div className="space-y-8">
        <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <Sparkles className="size-3.5" /> Powered by Lovable AI
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Workplace Productivity Assistant
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Five focused assistants that take the busywork out of your day — writing, summarizing,
            planning and researching — with every output editable before it leaves your hands.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold tracking-tight">Workspaces</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map(({ to, title, description, icon: Icon }) => (
              <Link key={to} to={to} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/40">
                  <CardHeader>
                    <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {title}
                      <ArrowRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                  <CardContent />
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
