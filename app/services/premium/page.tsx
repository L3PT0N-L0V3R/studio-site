import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function PremiumServicePage() {
  return (
    <main className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-500">Services</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Premium</h1>
            <p className="mt-3 max-w-2xl text-zinc-600">
              A premium build with deeper design system work, advanced motion, integrations, and priority support.
            </p>
          </div>

          <Link
            href="/#services"
            className="rounded-xl border bg-white px-3 py-2 text-sm hover:shadow-sm"
            >
            Back to services
            </Link>

        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border bg-white p-6">
            <h2 className="text-base font-semibold">Best for</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600">
              <li>Brands that need a high-end feel and interaction polish</li>
              <li>Teams integrating workflows/tools (CRM, intake, reporting)</li>
              <li>Growth-focused sites with iterative optimization</li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-white p-6 lg:col-span-2">
            <h2 className="text-base font-semibold">What’s included</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Design system</div>
                <div className="mt-1 text-sm text-zinc-600">Components, typography, spacing, consistency</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Advanced motion</div>
                <div className="mt-1 text-sm text-zinc-600">Premium interactions that remain performance-safe</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Integrations</div>
                <div className="mt-1 text-sm text-zinc-600">Forms, routing, CRM, automations, analytics</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Priority support</div>
                <div className="mt-1 text-sm text-zinc-600">Faster iteration cycles and tighter feedback loops</div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Estimated price ranges</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Ranges vary based on integrations, interactive scope, revision cycles, and content complexity. Intentionally wide.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">Very conservative</div>
              <div className="mt-1 text-2xl font-semibold">$15,000–$25,000</div>
              <div className="mt-1 text-sm text-zinc-600">Premium design + light integrations</div>
            </div>
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">Typical</div>
              <div className="mt-1 text-2xl font-semibold">$25,000–$60,000</div>
              <div className="mt-1 text-sm text-zinc-600">Deeper motion + systems, iteration and optimization</div>
            </div>
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">High end</div>
              <div className="mt-1 text-2xl font-semibold">$60,000–$150,000+</div>
              <div className="mt-1 text-sm text-zinc-600">Complex systems, extensive iteration, advanced scope</div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Timeline</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Conservative: 3–6 weeks. Typical: 6–12 weeks. High end: 12–24+ weeks.
          </p>
        </section>
      </Container>
    </main>
  );
}
