// app/work/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { workItems } from "@/components/sections/work/data";

export function generateStaticParams() {
  return workItems.map((w) => ({ slug: w.slug }));
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = workItems.find((w) => w.slug === slug);
  if (!item) return notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <Link
          href="/work"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to work
        </Link>

        <p className="mt-6 text-xs text-muted-foreground">{item.industry}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
          {item.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {item.tagline}
        </p>

        <div className="mt-6 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Note:</span> This is an
          example build template used to show our approach and deliverables.
          Client case studies replace these as projects go public.
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight">
              What we deliver
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {item.deliverables.map((d) => (
                <li key={d}>• {d}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="text-sm font-semibold tracking-tight">
              What we measure
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {item.measurementPlan.map((m) => (
                <li key={m}>• {m}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="text-sm font-semibold tracking-tight">Highlights</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {item.highlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Build something like this
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              See service options
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
