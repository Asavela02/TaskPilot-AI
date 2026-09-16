import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content: "Turn messy meeting notes or transcripts into decisions, action items and owners.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "Decisions, action items and owners from raw notes." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  return (
    <AppShell>
      <ToolWorkspace
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript and get a clean, shareable summary."
        icon={NotebookPen}
        actionLabel="Summarize notes"
        outputLabel="Meeting summary"
        system="You are an expert meeting scribe. Produce concise, factual summaries. Never invent decisions, owners or dates that are not in the notes; write 'Not stated' instead."
        fields={[
          { name: "title", label: "Meeting title", placeholder: "e.g. Q3 roadmap review" },
          { name: "notes", label: "Raw notes or transcript", type: "textarea", rows: 12, placeholder: "Paste your notes here…", required: true },
          { name: "audience", label: "Summary for", type: "select", options: ["Team", "Leadership", "Client", "Personal recap"] },
        ]}
        buildPrompt={(v) =>
          [
            `Summarize these meeting notes for: ${v.audience}.`,
            `Meeting title: ${v.title || "Not stated"}`,
            `Notes:\n${v.notes}`,
            "Return these sections, in this order:\n1. Overview (2-3 sentences)\n2. Key discussion points (bullets)\n3. Decisions made (bullets)\n4. Action items (bullet per item: task — owner — due date)\n5. Open questions / risks",
          ].join("\n\n")
        }
      />
    </AppShell>
  );
}
