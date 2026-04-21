"use client";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";

type Props = {
  shareUrl?: string;
  title: string;
  onRequestSave?: () => Promise<string | undefined>;
};

export function SharePopover({ shareUrl, title, onRequestSave }: Props) {
  const [open, setOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(shareUrl);
  const [saving, setSaving] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setResolvedUrl(shareUrl);
  }, [shareUrl]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !resolvedUrl) return;
    const abs = absoluteUrl(resolvedUrl);
    QRCode.toDataURL(abs, { margin: 1, width: 220, color: { dark: "#0a0a0a", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [open, resolvedUrl]);

  async function ensureUrl(): Promise<string | undefined> {
    if (resolvedUrl) return resolvedUrl;
    if (!onRequestSave) return undefined;
    setSaving(true);
    try {
      const u = await onRequestSave();
      if (u) setResolvedUrl(u);
      return u;
    } finally {
      setSaving(false);
    }
  }

  async function openMenu() {
    if (!resolvedUrl && onRequestSave) {
      await ensureUrl();
    }
    setOpen((o) => !o);
  }

  async function copyLink() {
    const u = (await ensureUrl()) ?? resolvedUrl;
    if (!u) return;
    try {
      await navigator.clipboard.writeText(absoluteUrl(u));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function openWhatsApp() {
    const u = (await ensureUrl()) ?? resolvedUrl;
    if (!u) return;
    const abs = absoluteUrl(u);
    const text = encodeURIComponent(`Here's the session: ${title}. ${abs}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }

  const disabled = !onRequestSave && !resolvedUrl;

  return (
    <div ref={rootRef} className="relative">
      <Button variant="secondary" size="sm" onClick={openMenu} disabled={disabled || saving} aria-haspopup="menu" aria-expanded={open}>
        {saving ? "Preparing" : "Share"}
      </Button>

      {open && (resolvedUrl || saving) && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden z-40" role="menu">
          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Share session</p>
              <p className="text-sm text-zinc-300 truncate" title={resolvedUrl ? absoluteUrl(resolvedUrl) : ""}>
                {resolvedUrl ? absoluteUrl(resolvedUrl) : "Saving..."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={copyLink} disabled={!resolvedUrl}>
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Button variant="secondary" size="sm" className="flex-1" onClick={openWhatsApp} disabled={!resolvedUrl}>
                WhatsApp
              </Button>
            </div>
            <div className="flex items-center justify-center bg-white rounded-xl p-3">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR code for session link" className="w-48 h-48" />
              ) : (
                <div className="w-48 h-48 grid place-items-center text-zinc-400 text-sm">Generating QR</div>
              )}
            </div>
            <p className="text-xs text-zinc-500 text-center">Scan from a phone to open the session.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function absoluteUrl(u: string) {
  if (typeof window === "undefined") return u;
  try {
    return new URL(u, window.location.origin).toString();
  } catch {
    return u;
  }
}
