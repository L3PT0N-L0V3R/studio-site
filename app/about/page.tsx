export default function AboutPage() {
  return (
    <main className="relative">
      {/* background wash that respects theme */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 520px at 12% 0%, hsl(var(--ui-glow)/0.14) 0%, rgba(255,255,255,0) 55%), radial-gradient(1000px 520px at 88% 10%, hsl(var(--ui-glow)/0.10) 0%, rgba(255,255,255,0) 60%), linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.98))",
        }}
      />

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16 sm:pt-20">
        {/* header */}
        <div className="max-w-3xl">
          <div className="text-xs text-zinc-500">About</div>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            A small team, built for high attention.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-zinc-600 sm:text-lg">
            We build websites from scratch, modernize systems teams have outgrown, and add features that
            move the business forward—without shipping brittle work.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#contact"
              className="inline-flex h-10 items-center justify-center rounded-2xl bg-zinc-950 px-5 text-sm font-medium text-white shadow-sm"
            >
              Get a quote
            </a>
            <a
              href="/services"
              className="inline-flex h-10 items-center justify-center rounded-2xl border border-black/10 bg-white px-5 text-sm font-medium text-zinc-950 shadow-sm"
              style={{ borderColor: "hsl(var(--ui-glow)/0.22)" }}
            >
              See services
            </a>
          </div>
        </div>

        {/* grid cards - matches the rest of your site */}
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {/* Card 1 */}
          <div
            className="relative overflow-hidden rounded-3xl border bg-white/75 p-6 shadow-sm backdrop-blur-sm"
            style={{ borderColor: "hsl(var(--ui-glow)/0.24)" }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--ui-glow)/0.10), rgba(255,255,255,0) 60%)",
              }}
            />
            <div className="relative">
              <div className="text-sm font-semibold text-zinc-950">Limited clients, on purpose</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                We keep capacity tight so your project gets senior attention, fast iteration, and clean
                decision-making.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Focused delivery
                </span>
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  End-to-end ownership
                </span>
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Clear milestones
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div
            className="relative overflow-hidden rounded-3xl border bg-white/75 p-6 shadow-sm backdrop-blur-sm"
            style={{ borderColor: "hsl(var(--ui-glow)/0.24)" }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--ui-glow)/0.10), rgba(255,255,255,0) 60%)",
              }}
            />
            <div className="relative">
              <div className="text-sm font-semibold text-zinc-950">Systems-first engineering</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Built and run by STEM students. We think in constraints, feedback loops, and maintainable
                architecture.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Modern stack
                </span>
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Measured iteration
                </span>
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Production discipline
                </span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div
            className="relative overflow-hidden rounded-3xl border bg-white/75 p-6 shadow-sm backdrop-blur-sm"
            style={{ borderColor: "hsl(var(--ui-glow)/0.24)" }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--ui-glow)/0.10), rgba(255,255,255,0) 60%)",
              }}
            />
            <div className="relative">
              <div className="text-sm font-semibold text-zinc-950">Budget-aware, value-driven</div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                We work with budgets when scope is honest. We don’t close a project until the system is
                complete.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Pacific Northwest
                </span>
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Growth-minded teams
                </span>
                <span className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700" style={{ borderColor: "hsl(var(--ui-glow)/0.20)" }}>
                  Practical timelines
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* “Process-page style” section blocks */}
        <div className="mt-12 grid gap-5 lg:grid-cols-12">
          <div
            className="lg:col-span-7 rounded-3xl border bg-white/80 p-7 shadow-sm"
            style={{ borderColor: "hsl(var(--ui-glow)/0.22)" }}
          >
            <div className="text-sm font-semibold text-zinc-950">What we’re great at</div>
            <p className="mt-2 text-sm text-zinc-600">
              Taking complexity and making it feel inevitable—clean UX, stable architecture, measurable outcomes.
            </p>

            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "New builds with clean IA and conversion paths",
                "Modern rebuilds that protect SEO and momentum",
                "Feature additions: booking, intake, portals, dashboards",
                "Systems wiring: CRM + automation + tracking",
                "Performance, accessibility, and production hardening",
                "Iteration plans that compound over time",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--ui-glow)/0.85)]" />
                  <span className="text-sm leading-relaxed text-zinc-700">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="lg:col-span-5 rounded-3xl border bg-white/80 p-7 shadow-sm"
            style={{ borderColor: "hsl(var(--ui-glow)/0.22)" }}
          >
            <div className="text-sm font-semibold text-zinc-950">Not a fit</div>
            <p className="mt-2 text-sm text-zinc-600">
              We protect quality and timelines. If this is you, we’ll likely say no.
            </p>

            <ul className="mt-5 grid gap-3">
              {[
                "Unwilling to invest (time, budget, or feedback)",
                "Looking for “cheap” instead of “effective”",
                "No interest in a strong online presence",
                "Refusing modern best practices (SEO, a11y, measurement)",
                "Expecting scope to expand without tradeoffs",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--ui-glow)/0.85)]" />
                  <span className="text-sm leading-relaxed text-zinc-700">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
