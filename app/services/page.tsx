import { Container } from "@/components/layout/container";
import { ServicesGrid } from "@/components/sections/services-page/services-grid";

export const metadata = {
  title: "Services",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="relative border-b">
        {/* background wash (theme-driven) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(1200px 520px at 50% 0%, hsl(var(--ui-glow) / 0.16), transparent 60%), var(--hero-wash)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.72), rgba(255,255,255,0.88))",
          }}
        />

        <Container className="relative py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-zinc-500">Services</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Systems-first builds, rebuilds, and upgrades.
            </h1>
            <p className="mt-4 text-zinc-600">
              We build from scratch, modernize sites that teams have outgrown, add features and
              integrations, and tighten performance, SEO, accessibility, and conversion paths—without
              shipping brittle work.
            </p>
          </div>

          <div className="mt-10">
            <ServicesGrid />
          </div>
        </Container>
      </section>
    </main>
  );
}
