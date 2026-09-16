import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { useState, type ComponentType } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/AiDisclaimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { runAssistant } from "@/lib/ai.functions";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  rows?: number;
};

type Props = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  fields: Field[];
  system: string;
  buildPrompt: (values: Record<string, string>) => string;
  actionLabel: string;
  outputLabel: string;
};

export function ToolWorkspace({
  title,
  description,
  icon: Icon,
  fields,
  system,
  buildPrompt,
  actionLabel,
  outputLabel,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.type === "select" ? (f.options?.[0] ?? "") : ""])),
  );
  const [output, setOutput] = useState("");

  const run = useServerFn(runAssistant);
  const mutation = useMutation({
    mutationFn: (prompt: string) => run({ data: { system, prompt } }),
    onSuccess: (result) => setOutput(result.text),
    onError: (error: Error) =>
      toast.error(error.message || "The assistant could not complete this request."),
  });

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const missing = fields.filter((f) => f.required && !values[f.name]?.trim());

  return (
    <div className="space-y-6">
      <header className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Prompt details</CardTitle>
            <CardDescription>
              The more context you give, the better the structured result.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    rows={field.rows ?? 5}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                ) : field.type === "select" ? (
                  <Select value={values[field.name]} onValueChange={(v) => set(field.name, v)}>
                    <SelectTrigger id={field.name}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) => set(field.name, e.target.value)}
                  />
                )}
              </div>
            ))}

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                onClick={() => mutation.mutate(buildPrompt(values))}
                disabled={mutation.isPending || missing.length > 0}
              >
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Sparkles className="size-4" />
                )}
                {mutation.isPending ? "Working…" : actionLabel}
              </Button>
              {output && (
                <Button
                  variant="outline"
                  onClick={() => mutation.mutate(buildPrompt(values))}
                  disabled={mutation.isPending}
                >
                  <RotateCcw className="size-4" />
                  Regenerate
                </Button>
              )}
            </div>
            {missing.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Fill in: {missing.map((f) => f.label).join(", ")}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <div>
              <CardTitle className="text-base">{outputLabel}</CardTitle>
              <CardDescription>Fully editable — refine it before you use it.</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy output"
              disabled={!output}
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied to clipboard");
              }}
            >
              <Copy className="size-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={18}
              placeholder="Your AI draft will appear here, ready to edit."
              className="h-full min-h-[380px] resize-y font-medium leading-relaxed"
            />
          </CardContent>
        </Card>
      </div>

      <AiDisclaimer />
    </div>
  );
}
