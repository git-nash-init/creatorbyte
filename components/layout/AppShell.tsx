"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-[264px]">
        <Topbar title={title} />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
