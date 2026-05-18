"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";

export type MediaFieldValue = {
  url: string;
  alt: string;
  cloudinaryPublicId: string;
};

type MediaPickerFieldProps = {
  label: string;
  hint?: string;
  value: MediaFieldValue;
  onChange: (next: MediaFieldValue) => void;
};

/** Upload flow mirrors `/api/admin/media/sign` — operators see previews only */
export function MediaPickerField({ label, hint, value, onChange }: MediaPickerFieldProps) {
  const [busy, setBusy] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  async function uploadFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    setMessage(null);
    try {
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: `sign-fashion/editor/${Math.floor(Date.now() / 1000)}` }),
      });
      const signJson = await signRes.json();
      if (!signRes.ok) throw new Error(typeof signJson?.error === "string" ? signJson.error : "Could not prepare upload");

      const { cloudName, apiKey, signature, timestamp, folder } = signJson as {
        cloudName: string;
        apiKey: string;
        signature: string;
        timestamp: number;
        folder: string;
      };

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", `${timestamp}`);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const uploadPayload = await uploadRes.json();
      if (!uploadRes.ok)
        throw new Error(typeof uploadPayload?.error?.message === "string" ? uploadPayload.error.message : "Upload failed");

      const secureUrl = typeof uploadPayload.secure_url === "string" ? uploadPayload.secure_url : "";
      const publicId = typeof uploadPayload.public_id === "string" ? uploadPayload.public_id : "";
      if (!secureUrl) throw new Error("Missing image URL");
      onChange({
        url: secureUrl,
        alt: value.alt || file.name.replace(/\.[^.]+$/, ""),
        cloudinaryPublicId: publicId,
      });
      setMessage("Image saved to your library.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-muted-foreground text-[0.7rem] font-medium uppercase tracking-wide">{label}</p>
        {hint && <p className="text-muted-foreground/90 mt-0.5 text-xs">{hint}</p>}
      </div>
      {value.url ?
        <div className="border-border overflow-hidden rounded-xl border bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
          <img src={value.url} alt="" className="aspect-[16/9] w-full object-cover sm:max-h-48" />
        </div>
      : <div className="border-border text-muted-foreground flex aspect-[16/9] max-h-40 items-center justify-center rounded-xl border border-dashed text-sm">
          No image yet — drop a file or paste a link
        </div>
      }
      <label className="border-border hover:border-white/25 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-white/[0.02] px-4 py-6 text-center text-xs text-zinc-400 transition-colors">
        <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={(e) => void uploadFile(e.target.files?.[0] ?? null)} />
        {busy ? "Uploading…" : "Drag & drop or click to upload"}
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <FieldStack label="Image link" sub="Or paste any https:// image">
          <Input
            className="border-border bg-background h-9 rounded-lg border px-3 text-sm"
            value={value.url}
            onChange={(e) => onChange({ ...value, url: e.target.value })}
            placeholder="https://"
          />
        </FieldStack>
        <FieldStack label="Describe the image" sub="Shown to assistive tech & search">
          <Input
            className="border-border bg-background h-9 rounded-lg border px-3 text-sm"
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
          />
        </FieldStack>
      </div>
      {message && <p className="text-xs text-zinc-400">{message}</p>}
    </div>
  );
}

function FieldStack({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-muted-foreground text-[0.65rem] uppercase tracking-wide">{label}</p>
      {sub && <p className="text-muted-foreground/80 mb-1 text-[0.7rem]">{sub}</p>}
      {children}
    </div>
  );
}
