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

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState<Budget>("Not sure yet");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          budget,
          message: message.trim(),
          source: "website-contact",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }

      setStatus("success");
      // optional: clear form
      setName("");
      setEmail("");
      setBudget("Not sure yet");
      setMessage("");
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
                      <div className="text-base font-semibold">Thanks — received.</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        We’ll reply soon. If you want to move faster, include a booking link in your
                        response template.
                      </div>
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
                        type="submit" // IMPORTANT: without this, shadcn defaults to type="button"
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
