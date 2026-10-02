"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { readSavedCode } from "@/lib/storage";

function subscribeSavedCode() {
  return () => undefined;
}

export function useSavedCardCode() {
  return useSyncExternalStore(subscribeSavedCode, readSavedCode, () => null);
}

type SavedCardLinkProps = {
  className?: string;
  fallbackHref?: string;
  children: React.ReactNode;
};

export function SavedCardLink({
  className,
  fallbackHref = "#registro",
  children,
}: SavedCardLinkProps) {
  const savedCode = useSavedCardCode();
  const href = savedCode ? `/lealtad/${savedCode}` : fallbackHref;

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
