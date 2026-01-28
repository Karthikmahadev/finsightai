"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If user is logged in, block public pages
    if (token) {
      router.replace("/home");
    }
  }, [router]);

  return <>{children}</>;
}
