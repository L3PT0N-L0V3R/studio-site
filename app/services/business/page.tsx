import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function BusinessServicePage() {
  return (
    <main className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-500">Services</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Business</h1>
            <p className="mt-3 max-w-2xl text-zinc-600">
              A stronger marketing site with more pages, clearer SEO structure, and CMS readiness when you need it.
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
              <li>Businesses with multiple offerings and pages</li>
              <li>Teams who need updates over time</li>
              <li>Stronger SEO + content structure</li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-white p-6 lg:col-span-2">
            <h2 className="text-base font-semibold">What’s included</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Pages</div>
                <div className="mt-1 text-sm text-zinc-600">5–10 pages (services, cases, FAQs, etc.)</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">CMS-ready</div>
                <div className="mt-1 text-sm text-zinc-600">Structured content for growth later</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">On-page SEO</div>
                <div className="mt-1 text-sm text-zinc-600">Intent structure, headings, internal linking</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Performance tuned</div>
                <div className="mt-1 text-sm text-zinc-600">Optimization for fast loads and stable UX</div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Estimated price ranges</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Ranges vary with content volume, CMS choice/integration, and iteration cycles. These are intentionally wide.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">Conservative</div>
              <div className="mt-1 text-2xl font-semibold">$3,000–$4,500</div>
              <div className="mt-1 text-sm text-zinc-600">Simple CMS-ready structure, content mostly provided</div>
            </div>
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">Typical</div>
              <div className="mt-1 text-2xl font-semibold">$4,500–$7,000</div>
              <div className="mt-1 text-sm text-zinc-600">More pages, stronger copy/design iteration, SEO structure</div>
            </div>
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">Complex</div>
              <div className="mt-1 text-2xl font-semibold">$7,000–$9,000+</div>
              <div className="mt-1 text-sm text-zinc-600">Heavy iteration, content system depth, advanced polish</div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Timeline</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Conservative: 1–2 weeks. Typical: 2–5 weeks. High end: 5–10+ weeks.
          </p>
        </section>
      </Container>
    </main>
  );
}
