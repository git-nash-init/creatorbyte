"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { LockedEditor } from "@/components/locked/LockedEditor";
import { useLockedStore } from "@/lib/store/lockedStore";
import { useMounted } from "@/lib/hooks/useMounted";
import { EmptyState } from "@/components/shared/EmptyState";
import { MdOutlinedButton } from "@/components/md";

export default function EditLockedContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  const router = useRouter();
  const item = useLockedStore((s) => s.items.find((i) => i.id === id));

  if (!mounted) return null;

  if (!item) {
    return (
      <EmptyState
        icon="search_off"
        title="Content not found"
        description="This locked content doesn't exist or was deleted."
        action={
          <MdOutlinedButton onClick={() => router.push("/locked")}>
            Back to Locked Content
          </MdOutlinedButton>
        }
      />
    );
  }

  return <LockedEditor key={item.id} initial={item} />;
}
