
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast"; // ✅ import Toaster

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "FinSight",
  description: "Finance Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}

        {/* 🔥 Global Toaster */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 5000, // Toast disappears after 5 seconds
            style: {
              fontFamily: "inherit",
            },
          }}
        />
      </body>
    </html>
  );
}
