"use client";

import { useEffect } from "react";
import { saveCardCode } from "@/lib/storage";

export function RememberCard({ code }: { code: string }) {
  useEffect(() => {
    saveCardCode(code);
  }, [code]);

  return null;
}
