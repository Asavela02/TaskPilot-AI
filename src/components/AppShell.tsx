import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bot,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/planner", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "Assistant Chat", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            }`}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar p-4">
      <Link to="/" onClick={onNavigate} className="mb-6 flex items-center gap-2.5 px-2 py-1">
        <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-sidebar-accent-foreground">
            Workplace AI
          </span>
          <span className="block text-xs text-sidebar-foreground/60">Productivity Assistant</span>
        </span>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <p className="mt-auto rounded-lg bg-sidebar-accent/50 p-3 text-xs text-sidebar-foreground/70">
        AI can make mistakes. Always review outputs before you share them.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sidebar-border md:block">
        <SidebarInner />
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-sidebar-border p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarInner onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">Workplace AI</span>
        </header>

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
