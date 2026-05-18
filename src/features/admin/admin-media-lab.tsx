"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminMediaLab() {
  const [busy, setBusy] = React.useState(false);
  const [banner, setBanner] = React.useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [publicIdHint, setPublicIdHint] = React.useState("");

  async function handleUpload(files: FileList | null) {
    const file = files?.item(0);
    if (!file) return;

    setBusy(true);
    setBanner(null);

    try {
      const signRes = await fetch("/api/admin/media/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: `sign-fashion/admin/${Math.floor(Date.now() / 1000)}` }),
      });

      const signJson = await signRes.json();

      if (!signRes.ok) {
        throw new Error(typeof signJson?.error === "string" ? signJson.error : "Signature rejected");
      }

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

      if (!uploadRes.ok) {
        throw new Error(typeof uploadPayload?.error?.message === "string" ?
            uploadPayload.error.message
          : "Upload refused");
      }

      setPublicIdHint(String(uploadPayload.public_id ?? ""));
      setBanner({ tone: "ok", text: "Upload complete — copy the asset reference into any image field in Studio." });
    } catch (err) {
      setBanner({
        tone: "err",
        text: err instanceof Error ? err.message : "Something went wrong uploading",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4">
      <p className="text-muted-foreground text-sm leading-relaxed">
        Files upload through a signed, direct connection so large lookbooks stay fast. You only manage the resulting asset reference.
      </p>
      <label className="flex flex-col gap-2 text-xs uppercase tracking-wide text-zinc-400">
        Image file
        <Input disabled={busy} type="file" accept="image/*" onChange={(event) => void handleUpload(event.target.files)} />
      </label>
      {publicIdHint && (
        <div className="rounded-lg border border-dashed border-emerald-500/40 bg-emerald-950/40 p-4 text-emerald-300 text-sm">
          <span className="text-[0.7rem] uppercase text-emerald-500">Asset reference</span>
          <p className="font-mono text-xs break-all">{publicIdHint}</p>
          <Button
            className="mt-3"
            size="xs"
            type="button"
            variant="outline"
            onClick={() => navigator.clipboard.writeText(publicIdHint)}
          >
            Copy to clipboard
          </Button>
        </div>
      )}
      {banner && (
        <p className={banner.tone === "ok" ? "text-emerald-400 text-sm" : "text-destructive text-sm"}>{banner.text}</p>
      )}
    </section>
  );
}
