"use client";

export const dynamic = "force-dynamic"; // prevent any SSR or static prerender
import EmailVerification from "./EmailVerfication";

 // must be at the very top


export default function Page() {
  return <EmailVerification />;
}
