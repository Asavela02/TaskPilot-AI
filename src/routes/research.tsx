import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — TaskPilot" },
      {
        name: "description",
        content: "Get a structured research briefing with key findings, comparisons, risks and open questions.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Structured briefings on any work topic in seconds." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <AppShell>
      <ToolWorkspace
        title="AI Research Assistant"
        description="Get a structured briefing on any work topic, with caveats where evidence is thin."
        icon={Search}
        actionLabel="Run research"
        outputLabel="Research briefing"
        system="You are a rigorous research analyst. Distinguish clearly between well-established facts, contested points and your own inference. Flag where information may be outdated and never fabricate sources, statistics or citations."
        fields={[
          { name: "topic", label: "Topic or question", type: "textarea", rows: 4, placeholder: "e.g. best practices for hybrid onboarding in mid-size firms", required: true },
          { name: "context", label: "Your context", placeholder: "e.g. 200-person fintech, EU based" },
          { name: "depth", label: "Depth", type: "select", options: ["Quick brief", "Standard briefing", "Deep dive"] },
          { name: "format", label: "Output format", type: "select", options: ["Executive summary", "Pros & cons", "Comparison table", "Q&A"] },
        ]}
        buildPrompt={(v) =>
          [
            `Research topic: ${v["topic"]}`,
            `Context: ${v["context"] || "Not stated"}`,
            `Depth: ${v["depth"]}. Preferred format: ${v["format"]}.`,
            "Return:\n1. Short answer / bottom line\n2. Key findings\n3. Trade-offs or competing views\n4. Practical recommendations for the stated context\n5. Confidence level and what to verify independently",
          ].join("\n\n")
        }
      />
    </AppShell>
  );
}
