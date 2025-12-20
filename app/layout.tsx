import "./globals.css";
import type { Metadata } from "next";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UiConfigProvider } from "@/components/providers/ui-config";

export const metadata: Metadata = {
  title: "Studio",
  description: "Web design + engineering for modern brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased ui-accent-pill">
          <UiConfigProvider>
            <div className="relative isolate min-h-screen">
              {/* Global theme wash (full-viewport) */}
              <div
                aria-hidden
                className="pointer-events-none fixed inset-0 -z-10"
                style={{
                  backgroundColor: "hsl(var(--background))",
                  // Layer 1 (top): fade to base background at the bottom
                  // Layer 2 (middle): theme wash (shared with homepage hero)
                  // Layer 3 (bottom): subtle secondary tone to keep the wash present across wide screens
                  backgroundImage:
                    "linear-gradient(to bottom, hsl(var(--background) / 0) 0%, hsl(var(--background) / 0) 70%, hsl(var(--background) / 1) 100%), var(--hero-wash), radial-gradient(900px circle at 82% 18%, hsl(var(--ui-glow-2) / 0.10), transparent 62%)",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center top",
                }}
              />

              <Navbar />
              <div aria-hidden className="h-14" />
              {children}
              <Footer />
            </div>
          </UiConfigProvider>
      </body>
    </html>
  );
}
