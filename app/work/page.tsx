// app/work/page.tsx

import Link from "next/link";
import { workItems } from "@/components/sections/work/data";

export const metadata = {
  title: "Work | Qubewise",
  description:
    "Example builds demonstrating how we ship conversion-first websites and lead pipelines.",
};

export default function WorkPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="max-w-3xl">
        <p className="text-sm text-muted-foreground">Work</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
          Example builds (templates)
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          These are representative examples used to demonstrate structure,
          deliverables, and measurement plans. As client projects go public, we
          replace these with real case studies and outcomes.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Request a quote
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            See services
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {workItems.map((item) => (
          <Link
            key={item.slug}
            href={`/work/${item.slug}`}
            className="rounded-2xl border bg-background p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-xs text-muted-foreground">{item.industry}</p>
            <h2 className="mt-2 text-lg font-semibold tracking-tight">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.tagline}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
