"use client";

import { useState } from "react";
import { MdIcon, MdIconButton } from "@/components/md";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <MdIconButton aria-label="Copy link" title={copied ? "Copied!" : "Copy link"} onClick={copy}>
      <MdIcon>{copied ? "check" : "content_copy"}</MdIcon>
    </MdIconButton>
  );
}

export function OpenLinkButton({ href }: { href: string }) {
  return (
    <MdIconButton
      aria-label="Open page"
      title="Open page"
      onClick={() => window.open(href, "_blank")}
    >
      <MdIcon>language</MdIcon>
    </MdIconButton>
  );
}
