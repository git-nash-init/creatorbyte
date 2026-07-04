"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PaymentPageEditor } from "@/components/payments/PaymentPageEditor";
import { usePagesStore } from "@/lib/store/pagesStore";
import { useMounted } from "@/lib/hooks/useMounted";
import { EmptyState } from "@/components/shared/EmptyState";
import { MdOutlinedButton } from "@/components/md";

export default function EditPaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const mounted = useMounted();
  const router = useRouter();
  const page = usePagesStore((s) => s.pages.find((p) => p.id === id));

  if (!mounted) return null;

  if (!page) {
    return (
      <EmptyState
        icon="search_off"
        title="Page not found"
        description="This payment page doesn't exist or was deleted."
        action={
          <MdOutlinedButton onClick={() => router.push("/payments")}>
            Back to Payment Pages
          </MdOutlinedButton>
        }
      />
    );
  }

  return <PaymentPageEditor key={page.id} initial={page} />;
}
