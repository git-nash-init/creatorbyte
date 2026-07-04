"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useMounted } from "@/lib/hooks/useMounted";

export default function ProfilePage() {
  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Profile"
        subtitle="How you appear on your payment pages and locked content"
      />
      <ProfileForm />
    </div>
  );
}
