"use client";

import { useState } from "react";
import { LockedEditor } from "@/components/locked/LockedEditor";
import { emptyLockedContent } from "@/lib/store/lockedStore";
import { useMounted } from "@/lib/hooks/useMounted";

export default function NewLockedContentPage() {
  const mounted = useMounted();
  const [initial] = useState(emptyLockedContent);
  if (!mounted) return null;
  return <LockedEditor initial={initial} />;
}
