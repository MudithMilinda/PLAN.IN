import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PLAN.IN - AI-Powered Event Marketing",
  description: "Promote your events with AI-powered marketing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      appearance={{ theme: dark }}
    >
      <html lang="en">
        <body
          className={`${inter.className} min-h-screen text-white`}
          style={{
            backgroundColor: "#050020",
            backgroundAttachment: "fixed", // keeps background fixed
          }}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
