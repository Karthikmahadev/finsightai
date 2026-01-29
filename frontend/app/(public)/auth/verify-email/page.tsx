"use client";

import { Suspense } from "react";
import EmailVerification from "./EmailVerfication";


export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerification />
    </Suspense>
  );
}
