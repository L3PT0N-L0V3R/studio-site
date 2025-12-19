import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { FadeIn } from "@/components/motion/fade-in";
import { ScaleIn } from "@/components/motion/scale-in";

import { POSITIONING_LINE } from "@/content/site";
import { processSteps } from "@/content/process";

import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProcessStepPage({ params }: Props) {
  const { slug } = await params;

  const step = processSteps.find((s) => s.slug === slug);
  if (!step) return notFound();

  const idx = processSteps.findIndex((s) => s.slug === step.slug);
  const prev = idx > 0 ? processSteps[idx - 1] : null;
  const next = idx < processSteps.length - 1 ? processSteps[idx + 1] : null;

  return (
    <section className="border-b">
      <Container className="py-10 sm:py-14">
        <FadeIn>
          <nav className="text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/#process" className="hover:text-zinc-900">
              Process
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-700">{step.title}</span>
          </nav>
        </FadeIn>

        <ScaleIn from={0.92}>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Step {step.step}</Badge>
                <Badge variant="outline">{step.slug}</Badge>
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {step.title}
              </h1>

              <p className="mt-3 max-w-2xl text-zinc-600">{step.summary}</p>
              <p className="mt-3 max-w-2xl text-sm text-zinc-500">{POSITIONING_LINE}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <a href="/#contact" className="... ui-accent-cta">Get a quote</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/#work" className="... ui-accent-underline">View work</a>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {step.flexibility.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </ScaleIn>

        <Separator className="my-10" />

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <ScaleIn from={0.94}>
              <Card>
                <CardHeader>
                  <div className="text-base font-semibold">What this step accomplishes</div>
                  <div className="text-sm text-zinc-600">
                    The goal is clarity + momentum with an upgrade path if needed.
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {step.accomplishes.map((a) => (
                    <div key={a} className="flex items-start gap-2 text-sm text-zinc-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-zinc-900" />
                      <span>{a}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScaleIn>

            <ScaleIn from={0.94} delay={0.06}>
              <Card>
                <CardHeader>
                  <div className="text-base font-semibold">Deliverables</div>
                  <div className="text-sm text-zinc-600">What you get at the end of this step.</div>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {step.deliverables.map((d) => (
                    <div key={d} className="text-sm text-zinc-700">
                      • {d}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScaleIn>

            <ScaleIn from={0.94} delay={0.12}>
              <Card>
                <CardHeader>
                  <div className="text-base font-semibold">Flex options</div>
                  <div className="text-sm text-zinc-600">
                    Choose the level of complexity that fits the business today.
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-3">
                  {step.flexOptions.map((opt) => (
                    <div key={opt.label} className="rounded-2xl border bg-white p-4">
                      <div className="text-sm font-semibold">{opt.label}</div>
                      <div className="mt-1 text-sm text-zinc-600">{opt.description}</div>
                      <div className="mt-3 grid gap-1 text-xs text-zinc-700">
                        {opt.includes.map((i) => (
                          <div key={i}>• {i}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScaleIn>
          </div>

          <div className="space-y-4">
            <ScaleIn from={0.94}>
              <Card>
                <CardHeader>
                  <div className="text-base font-semibold">What we need</div>
                  <div className="text-sm text-zinc-600">To move quickly and stay aligned.</div>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {step.needs.map((n) => (
                    <div key={n} className="text-sm text-zinc-700">
                      • {n}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScaleIn>

            <ScaleIn from={0.94} delay={0.06}>
              <Card>
                <CardHeader>
                  <div className="text-base font-semibold">Timeline</div>
                  <div className="text-sm text-zinc-600">Typical ranges, scoped as needed.</div>
                </CardHeader>
                <CardContent className="grid gap-2">
                  {step.timeline.map((t) => (
                    <div key={t} className="text-sm text-zinc-700">
                      • {t}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </ScaleIn>

            <ScaleIn from={0.94} delay={0.12}>
              <Card>
                <CardHeader>
                  <div className="text-base font-semibold">Optional modules</div>
                  <div className="text-sm text-zinc-600">
                    Add these only if they increase leverage.
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {step.modules.map((m) => (
                    <span
                      key={m}
                      className="rounded-full border bg-white px-3 py-1 text-xs text-zinc-700"
                    >
                      {m}
                    </span>
                  ))}
                </CardContent>
              </Card>
            </ScaleIn>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div>
            {prev ? (
              <Link
                href={`/process/${prev.slug}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
              >
                <ArrowLeft className="h-4 w-4" />
                {prev.title}
              </Link>
            ) : (
              <span className="text-sm text-zinc-400"> </span>
            )}
          </div>

          <div>
            {next ? (
              <Link
                href={`/process/${next.slug}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
              >
                {next.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
              >
                Get a quote <ArrowRight className="h-4 w-4 ui-accent-cta" />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
