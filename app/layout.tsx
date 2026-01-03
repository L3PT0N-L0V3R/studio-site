import "./globals.css";
import type { Metadata } from "next";

import { BRAND } from "@/lib/brand";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { UiConfigProvider } from "@/components/providers/ui-config";
import { ScrollRestoration } from "@/components/scroll-restoration";
import { StructuredData } from "@/components/seo/structured-data";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.tagline,
  openGraph: {
    title: BRAND.name,
    description: BRAND.tagline,
    url: BRAND.url,
    siteName: BRAND.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description: BRAND.tagline,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="classic">
      <body className="min-h-screen bg-background text-foreground antialiased ui-accent-pill">
        {/* JSON-LD: Organization / Website */}
        <StructuredData />

        <UiConfigProvider>
          <ScrollRestoration />
          <div className="relative isolate min-h-screen">
            {/* Global theme wash (full-viewport) */}
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 -z-10"
              style={{
                backgroundColor: "hsl(var(--background))",
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

          {/* Field metrics in Vercel dashboard */}
          <SpeedInsights />
        </UiConfigProvider>
      </body>
    </html>
  );
}
