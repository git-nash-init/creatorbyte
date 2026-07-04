"use client";

import { useState } from "react";
import { PaymentPageEditor } from "@/components/payments/PaymentPageEditor";
import { emptyPaymentPage } from "@/lib/store/pagesStore";
import { useMounted } from "@/lib/hooks/useMounted";

export default function NewPaymentPage() {
  const mounted = useMounted();
  const [initial] = useState(emptyPaymentPage);
  if (!mounted) return null;
  return <PaymentPageEditor initial={initial} />;
}
