import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "@/components/ToolWorkspace";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — TaskPilot" },
      {
        name: "description",
        content: "Break any work goal into a prioritized, time-boxed task plan with milestones.",
      },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Turn a goal into a prioritized, time-boxed plan." },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <AppShell>
      <ToolWorkspace
        title="AI Task Planner"
        description="Describe your goal and constraints, and get an execution plan you can edit."
        icon={ListChecks}
        actionLabel="Build plan"
        outputLabel="Task plan"
        system="You are an experienced project planner. Produce realistic, prioritized plans with clear sequencing, effort estimates and dependencies. Be specific and avoid filler."
        fields={[
          { name: "goal", label: "Goal or project", type: "textarea", rows: 4, placeholder: "e.g. launch the new onboarding flow", required: true },
          { name: "timeframe", label: "Timeframe", placeholder: "e.g. 2 weeks" },
          { name: "capacity", label: "People / capacity", placeholder: "e.g. me plus one designer, 10h/week" },
          { name: "style", label: "Plan style", type: "select", options: ["Daily checklist", "Weekly milestones", "Kanban backlog", "Priority matrix"] },
        ]}
        buildPrompt={(v) =>
          [
            `Create a ${v["style"]} plan for this goal: ${v["goal"]}`,
            `Timeframe: ${v["timeframe"] || "Not stated"}`,
            `Capacity: ${v["capacity"] || "Not stated"}`,
            "Return:\n1. Objective restated in one line\n2. The plan, grouped by day/week/column as appropriate, each task with priority (High/Med/Low) and an effort estimate\n3. Dependencies and sequencing notes\n4. Top 3 risks and how to mitigate them",
          ].join("\n\n")
        }
      />
    </AppShell>
  );
}
