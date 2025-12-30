"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  TIER_LABEL,
  TIER_SUBHEAD,
  evaluateQuiz,
  quizQuestions,
  type QuizAnswerMap,
  type ServiceTier,
} from "@/content/service-quiz";

function tierIncludes(tier: ServiceTier): string[] {
  if (tier === "starter")
    return ["Core pages", "Contact/quote flow", "Basic SEO + analytics", "Mobile-first polish"];
  if (tier === "growth")
    return ["Everything in Starter", "Event tracking", "Conversion structure", "Iteration plan"];
  return ["Everything in Growth", "CRM pipeline", "Automation", "Workflow modules (as scoped)"];
}

function buildSummary(recommended: ServiceTier, answers: QuizAnswerMap) {
  const lines: string[] = [];
  lines.push(`Recommended tier: ${TIER_LABEL[recommended]}`);
  lines.push("");
  lines.push("Answers:");
  for (const q of quizQuestions) {
    const a = answers[q.id];
    if (!a) continue;
    const opt = q.options.find((o) => o.id === a);
    lines.push(`- ${q.prompt} -> ${opt?.label ?? a}`);
  }
  return lines.join("\n");
}

export function ServiceQuiz({
  dense = false,
  layout = "vertical",
}: {
  dense?: boolean;
  layout?: "vertical" | "horizontal";
}) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerMap>({});
  const [copied, setCopied] = useState(false);

  const isDone = idx >= quizQuestions.length;
  const current = quizQuestions[Math.min(idx, quizQuestions.length - 1)];

  const result = useMemo(() => (isDone ? evaluateQuiz(answers) : null), [isDone, answers]);

  const progressLabel = isDone ? "Results" : `Q${idx + 1}/${quizQuestions.length}`;
  const progressPct = isDone ? 100 : Math.round(((idx + 1) / quizQuestions.length) * 100);

  const padHeader = dense ? "p-4" : "p-6";
  const padContent = dense ? "px-4 pb-4" : "px-6 pb-6";
  const gapBlock = dense ? "gap-3" : "gap-5";
  const optionPad = dense ? "px-3 py-2.5" : "px-4 py-3";
  const optionRadius = dense ? "rounded-xl" : "rounded-2xl";

  const isHorizontal = layout === "horizontal";

  const optionGridClass = isHorizontal ? "grid gap-2 sm:grid-cols-2" : "grid gap-2";

  const headerRowClass = isHorizontal
    ? "flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
    : "flex items-start justify-between gap-3";

  function select(optionId: string) {
    setCopied(false);
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    setIdx((n) => n + 1);
  }

  function back() {
    setCopied(false);
    setIdx((n) => Math.max(0, n - 1));
  }

  function reset() {
    setCopied(false);
    setAnswers({});
    setIdx(0);
  }

  async function copySummary() {
    if (!result) return;
    const txt = buildSummary(result.recommended, answers);
    try {
      await navigator.clipboard.writeText(txt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className={`${padHeader} space-y-2`}>
        <div className={headerRowClass}>
          <div>
            <div className="text-sm font-semibold">Best-fit build questionaire</div>
            <div className="mt-1 text-xs text-zinc-600">
              Answer 7 questions. We’ll recommend Starter, Growth, or Systems.
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[11px]">
              {progressLabel}
            </Badge>
            <span className="text-[11px] text-zinc-500">{progressPct}%</span>
          </div>
        </div>

        <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-full bg-zinc-900" style={{ width: `${progressPct}%` }} />
        </div>
      </CardHeader>

      <CardContent className={padContent}>
        <AnimatePresence mode="popLayout">
          {!isDone ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.22 }}
              className={`grid ${gapBlock}`}
            >
              <div>
                <div className="text-base font-semibold">{current.prompt}</div>
                {current.helper ? (
                  <div className="mt-1 text-xs text-zinc-600">{current.helper}</div>
                ) : null}
              </div>

              <div className={optionGridClass}>
                {current.options.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => select(o.id)}
                    className={[
                      "group border bg-white text-left transition",
                      optionRadius,
                      optionPad,
                      "active:translate-y-0",
                      "focus:outline-none focus:ring-2 focus:ring-zinc-900/10",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-zinc-900">{o.label}</div>
                      <span className="text-[11px] text-zinc-500 opacity-0 transition group-hover:opacity-100">
                        Select
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button variant="ghost" onClick={back} disabled={idx === 0} className="h-8 px-2">
                  Back
                </Button>
                <div className="text-[11px] text-zinc-500">
                  {Object.keys(answers).length} / {quizQuestions.length} answered
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className={`grid ${dense ? "gap-4" : "gap-6"}`}
            >
              <div>
                <div className="text-xs text-zinc-600">Recommended</div>
                <div className="text-xl font-semibold tracking-tight">
                  {TIER_LABEL[result!.recommended]}
                </div>
                <div className="mt-2 text-sm text-zinc-600">
                  {TIER_SUBHEAD[result!.recommended]}
                </div>

                {result!.closeSecond ? (
                  <div className="mt-2 text-xs text-zinc-600">
                    Close second:{" "}
                    <span className="font-medium text-zinc-900">
                      {TIER_LABEL[result!.closeSecond]}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3">
                <div className="rounded-xl border bg-white p-3">
                  <div className="text-sm font-semibold">Because you said…</div>
                  <div className="mt-2 grid gap-1.5 text-sm text-zinc-700">
                    {result!.because.map((b) => (
                      <div key={b}>• {b}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border bg-white p-3">
                  <div className="text-sm font-semibold">Included</div>
                  <div className="mt-2 grid gap-1.5 text-sm text-zinc-700">
                    {tierIncludes(result!.recommended).map((x) => (
                      <div key={x}>• {x}</div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-wrap items-center gap-2 ui-accent-cta">
                <Button asChild className="h-9">
                  <a href="#contact">Get a quote</a>
                </Button>

                <Button variant="outline" onClick={copySummary} className="h-9">
                  {copied ? "Copied" : "Copy summary"}
                </Button>

                <Button variant="ghost" onClick={reset} className="h-9 px-2">
                  Restart
                </Button>
              </div>

              {!dense ? (
                <div className="text-xs text-zinc-500">
                  Tip: click “Copy summary,” then paste it into your message when you contact us.
                </div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
