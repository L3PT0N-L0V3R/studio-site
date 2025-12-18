import Link from "next/link";
import { Container } from "@/components/layout/container";

export default function StarterServicePage() {
  return (
    <main className="border-b">
      <Container className="py-14 sm:py-20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-500">Services</div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Starter</h1>
            <p className="mt-3 max-w-2xl text-zinc-600">
              A clean, modern site that launches fast—optimized for clarity, mobile, and a strong first impression.
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
              <li>New businesses, solo operators, local services</li>
              <li>“My current site is weak/nonexistent”</li>
              <li>Fast launch with strong fundamentals</li>
            </ul>
          </section>

          <section className="rounded-2xl border bg-white p-6 lg:col-span-2">
            <h2 className="text-base font-semibold">What’s included</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Pages</div>
                <div className="mt-1 text-sm text-zinc-600">1–3 pages (home + core intent pages)</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Mobile-first</div>
                <div className="mt-1 text-sm text-zinc-600">Responsive layout, spacing, type scale</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">SEO baseline</div>
                <div className="mt-1 text-sm text-zinc-600">Metadata, indexing hygiene, structure</div>
              </div>
              <div className="rounded-xl border bg-zinc-50/60 p-4">
                <div className="text-sm font-semibold">Analytics</div>
                <div className="mt-1 text-sm text-zinc-600">Basic tracking + conversion events (if desired)</div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Estimated price ranges</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Ranges vary by copy readiness, brand assets, number of sections, and revision cycles. These are intentionally wide.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">Very conservative</div>
              <div className="mt-1 text-2xl font-semibold">$1,500–$3,000</div>
              <div className="mt-1 text-sm text-zinc-600">Tight scope, content provided, minimal revisions</div>
            </div>
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">Typical</div>
              <div className="mt-1 text-2xl font-semibold">$3,000–$6,000</div>
              <div className="mt-1 text-sm text-zinc-600">Copy help, light design system, best-practice polish</div>
            </div>
            <div className="rounded-xl border bg-zinc-50/60 p-4">
              <div className="text-sm font-semibold">High end</div>
              <div className="mt-1 text-2xl font-semibold">$6,000–$12,000+</div>
              <div className="mt-1 text-sm text-zinc-600">Premium polish, animation, iteration, assets</div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-white p-6">
          <h2 className="text-base font-semibold">Timeline</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Conservative: 3–7 days. Typical: 1–2 weeks. High end: 2–4+ weeks (depending on iteration and assets).
          </p>
        </section>
      </Container>
    </main>
  );
}
