import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content: "Draft professional workplace emails from a few bullet points, in the tone you choose.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "Turn bullet points into polished business emails." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <AppShell>
      <ToolWorkspace
        title="Smart Email Generator"
        description="Describe the situation and get a clear, professional email you can edit and send."
        icon={Mail}
        actionLabel="Generate email"
        outputLabel="Draft email"
        system="You are an expert business communication writer. Write clear, concise, professional emails. Always return a subject line, then the email body with a greeting and sign-off. Use plain text, no markdown headings."
        fields={[
          { name: "recipient", label: "Recipient & relationship", placeholder: "e.g. Client, Priya at Acme", required: true },
          { name: "purpose", label: "Purpose / key points", type: "textarea", rows: 6, placeholder: "e.g. project delayed by 1 week, propose new date, apologise", required: true },
          { name: "tone", label: "Tone", type: "select", options: ["Professional", "Friendly", "Formal", "Direct", "Apologetic", "Persuasive"] },
          { name: "length", label: "Length", type: "select", options: ["Short", "Medium", "Detailed"] },
        ]}
        buildPrompt={(v) =>
          [
            "Write a workplace email.",
            `Recipient: ${v.recipient}`,
            `Key points to cover:\n${v.purpose}`,
            `Tone: ${v.tone}`,
            `Length: ${v.length}`,
            "Output format:\nSubject: <subject line>\n\n<email body>",
          ].join("\n\n")
        }
      />
    </AppShell>
  );
}
