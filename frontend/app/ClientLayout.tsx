// app/ClientLayout.tsx
"use client";

import { Toaster } from "react-hot-toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 5000, style: { fontFamily: "inherit" }}} />
    </>
  );
}
