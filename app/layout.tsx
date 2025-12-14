import "./globals.css";
import type { Metadata } from "next";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { SitePreferencesProvider } from "@/components/providers/site-preferences";
import { UiConfigProvider } from "@/components/providers/ui-config";

export const metadata: Metadata = {
  title: "Studio",
  description: "Web design + engineering for modern brands.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <SitePreferencesProvider>
          <UiConfigProvider>
            <Navbar />
            {children}
            <Footer />
          </UiConfigProvider>
        </SitePreferencesProvider>
      </body>
    </html>
  );
}
