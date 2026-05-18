"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChipTokenField({
  label,
  hint,
  values,
  onChange,
  presets,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (next: string[]) => void;
  presets?: string[];
}) {
  const [draft, setDraft] = React.useState("");

  function add(raw: string) {
    const next = raw.split(/[,|]/g).map((s) => s.trim()).filter(Boolean);
    if (!next.length) return;
    const merged = [...values];
    for (const token of next)
      if (!merged.includes(token)) merged.push(token);
    onChange(merged);
    setDraft("");
  }

  return (
    <div className="space-y-2">
      <div>
        <p className="text-muted-foreground text-[0.7rem] font-medium uppercase tracking-wide">{label}</p>
        {hint && <p className="text-muted-foreground/90 mt-0.5 text-xs">{hint}</p>}
      </div>
      {presets?.length ?
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              className="border-border hover:border-foreground/40 rounded-full border px-2.5 py-0.5 text-xs text-zinc-300 transition-colors"
              onClick={() => {
                if (!values.includes(preset)) onChange([...values, preset]);
              }}
            >
              + {preset}
            </button>
          ))}
        </div>
      : null}
      <div className="flex flex-wrap gap-2">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-zinc-100"
          >
            {tag}
            <button
              type="button"
              className="text-zinc-500 hover:text-white"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(values.filter((t) => t !== tag))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            }
          }}
          placeholder="Type and press Enter"
          className="border-border bg-background h-9 flex-1 rounded-lg border px-3 text-sm"
        />
        <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => add(draft)}>
          Add
        </Button>
      </div>
    </div>
  );
}
