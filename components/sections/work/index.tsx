// components/sections/work/index.tsx

import Link from "next/link";
import { workItems } from "./data";

type Props = {
  id?: string;
};

export default function WorkSection({ id = "work" }: Props) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-6xl px-6 py-20">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">Work</p>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Example builds (templates)
            </h2>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              Until we have public client case studies, these are representative
              builds that show how we structure conversion, performance, and lead
              handling. Each one includes a measurement plan.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/work"
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              View all
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Start a build
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {workItems.map((item) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className="group rounded-2xl border bg-background p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">{item.industry}</p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.tagline}
                  </p>
                </div>
                <div className="mt-1 text-sm text-muted-foreground transition group-hover:translate-x-0.5">
                  →
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Key highlights
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {item.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="text-muted-foreground">
                      • {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {item.deliverables.slice(0, 3).map((d) => (
                  <span
                    key={d}
                    className="rounded-full border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
