"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

type Budget =
  | "Starter (1k–6k)"
  | "Business (3k–9k)"
  | "Premium (6k–20k)"
  | "Not sure yet";

type ApiResponse =
  | { ok: true; delivered: true; requestId: string }
  | {
      ok: true;
      delivered: false;
      requestId: string;
      fallback?: { mailto: string; email: string };
    }
  | { ok: false; error: string; requestId?: string };

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState<Budget>("Not sure yet");
  const [message, setMessage] = useState("");

  // Honeypot (hidden field). Humans never fill it; bots often do.
  const [website, setWebsite] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [requestId, setRequestId] = useState<string | null>(null);
  const [delivered, setDelivered] = useState<boolean>(true);
  const [fallback, setFallback] = useState<{ mailto: string; email: string } | null>(null);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length >= 2 &&
      email.trim().includes("@") &&
      message.trim().length >= 10 &&
      status !== "submitting"
    );
  }, [name, email, message, status]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setStatus("submitting");
    setRequestId(null);
    setDelivered(true);
    setFallback(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          budget,
          message: message.trim(),
          website, // honeypot
          source: "website-contact",
        }),
      });

      const data = (await res.json().catch(() => null)) as ApiResponse | null;

      if (!res.ok || !data) {
        throw new Error((data as any)?.error || `Request failed (${res.status})`);
      }

      if ("ok" in data && data.ok === false) {
        throw new Error(data.error || "Something went wrong.");
      }

      // Success path
      if ("requestId" in data) setRequestId(data.requestId);

      if ("delivered" in data && data.delivered === false) {
        setDelivered(false);
        if ("fallback" in data && data.fallback) setFallback(data.fallback);
        setStatus("success");
        // Keep fields (so user can re-send or copy) — do NOT clear.
        return;
      }

      setDelivered(true);
      setStatus("success");

      // Clear form on confirmed delivery
      setName("");
      setEmail("");
      setBudget("Not sure yet");
      setMessage("");
      setWebsite("");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong.");
    }
  }

  return (
    <section id="contact">
      <Container className="py-14 sm:py-20">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
          <p className="mt-2 text-zinc-600">
            Tell us what you’re building. We’ll respond with next steps and an estimate range.
          </p>
        </FadeIn>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <FadeIn delay={0.05}>
              <Card>
                <CardHeader>
                  <div className="text-base font-semibold">Quick inquiry</div>
                  <div className="text-sm text-zinc-600">
                    Usually a same-day reply. If it’s urgent, mention it.
                  </div>
                </CardHeader>

                <CardContent>
                  {status === "success" ? (
                    <div className="rounded-2xl border bg-white p-5">
                      <div className="text-base font-semibold">
                        {delivered ? "Thanks — received." : "Received — delivery not confirmed."}
                      </div>

                      <div className="mt-1 text-sm text-zinc-600">
                        {delivered ? (
                          <>
                            We’ll reply soon. If you want to move faster, we can include a booking link
                            in our response.
                          </>
                        ) : (
                          <>
                            Your message was accepted, but our delivery system did not confirm email
                            notification. If you don’t hear back within 1 business day, please email us
                            directly using the reference below.
                          </>
                        )}
                      </div>

                      {requestId ? (
                        <div className="mt-3 rounded-xl border bg-muted/20 px-3 py-2 text-sm">
                          <span className="text-zinc-600">Reference:</span>{" "}
                          <span className="font-mono">{requestId}</span>
                        </div>
                      ) : null}

                      {!delivered && fallback ? (
                        <div className="mt-4 rounded-2xl border bg-white p-4">
                          <div className="text-sm font-medium">Fallback email</div>
                          <div className="mt-1 text-sm text-zinc-600">{fallback.email}</div>
                          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                            <Button asChild variant="outline" className="rounded-2xl">
                              <a href={fallback.mailto}>Email us now</a>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-2xl"
                              onClick={() => {
                                navigator.clipboard?.writeText(fallback.email);
                              }}
                            >
                              Copy email
                            </Button>
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStatus("idle")}
                          className="rounded-2xl"
                        >
                          Send another
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={onSubmit} className="space-y-3">
                      {/* Honeypot field (hidden) */}
                      <div className="hidden">
                        <label className="grid gap-1 text-sm">
                          <span>Website</span>
                          <input
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="h-11 rounded-2xl border bg-white px-4 outline-none"
                            placeholder="https://"
                            autoComplete="off"
                            tabIndex={-1}
                          />
                        </label>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm">
                          <span className="text-zinc-700">Name</span>
                          <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={cn(
                              "h-11 rounded-2xl border bg-white px-4 outline-none",
                              "focus:ring-2 focus:ring-zinc-300"
                            )}
                            placeholder="Your name"
                            autoComplete="name"
                            required
                          />
                        </label>

                        <label className="grid gap-1 text-sm">
                          <span className="text-zinc-700">Email</span>
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={cn(
                              "h-11 rounded-2xl border bg-white px-4 outline-none",
                              "focus:ring-2 focus:ring-zinc-300"
                            )}
                            placeholder="you@company.com"
                            autoComplete="email"
                            required
                          />
                        </label>
                      </div>

                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-700">Budget range</span>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value as Budget)}
                          className={cn(
                            "h-11 rounded-2xl border bg-white px-4 outline-none",
                            "focus:ring-2 focus:ring-zinc-300"
                          )}
                        >
                          <option>Not sure yet</option>
                          <option>Starter (1k–6k)</option>
                          <option>Business (3k–9k)</option>
                          <option>Premium (6k–20k)</option>
                        </select>
                      </label>

                      <label className="grid gap-1 text-sm">
                        <span className="text-zinc-700">What you need built</span>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={cn(
                            "min-h-[120px] rounded-2xl border bg-white px-4 py-3 outline-none",
                            "focus:ring-2 focus:ring-zinc-300"
                          )}
                          placeholder="Quick summary: goals, pages/features, timeline, anything important."
                          required
                        />
                      </label>

                      {status === "error" && errorMsg ? (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          {errorMsg}
                        </div>
                      ) : null}

                      <Button
                        type="submit"
                        className="mt-2 w-full rounded-2xl"
                        disabled={!canSubmit}
                      >
                        {status === "submitting" ? "Submitting..." : "Submit"}
                      </Button>

                      <div className="text-xs text-zinc-500">
                        By submitting, you agree we can email you about this inquiry.
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border bg-white p-6">
                <div className="text-base font-semibold">What happens next</div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                  <li>• We reply with a recommended path + estimate range</li>
                  <li>• You can book a quick intro call if you want speed</li>
                  <li>• If it’s a fit, we scope and send a simple proposal</li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
