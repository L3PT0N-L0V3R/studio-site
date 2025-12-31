import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

const FORMSPREE_ACTION = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "";

// Optional: put your Google Appointment Schedule / Calendly / etc.
const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

export function Contact() {
  return (
    <section id="contact">
      <Container className="py-14 sm:py-20">
        <FadeIn>
          <h2 className="text-2xl font-semibold tracking-tight">Get a quote</h2>
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
                    We reply within 1 business day. If you want to move faster, book a call.
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <form action={FORMSPREE_ACTION} method="POST" className="space-y-3">
                    {/* Anti-spam honeypot */}
                    <input type="text" name="_gotcha" className="hidden" />

                    {/* Email subject line in your inbox */}
                    <input type="hidden" name="_subject" value="New lead — Qubewise" />

                    {/* Redirect after submit (optional). You can create /thanks page later. */}
                    {/* <input type="hidden" name="_next" value="https://qubewise.com/thanks" /> */}

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-900" htmlFor="name">
                          Name
                        </label>
                        <input
                          id="name"
                          name="name"
                          required
                          autoComplete="name"
                          className={cn(
                            "h-11 w-full rounded-xl border bg-white px-3 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-zinc-300"
                          )}
                          placeholder="Your name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-sm font-medium text-zinc-900" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className={cn(
                            "h-11 w-full rounded-xl border bg-white px-3 text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-zinc-300"
                          )}
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-900" htmlFor="budget">
                        Budget range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        required
                        defaultValue=""
                        className={cn(
                          "h-11 w-full rounded-xl border bg-white px-3 text-sm",
                          "focus:outline-none focus:ring-2 focus:ring-zinc-300"
                        )}
                      >
                        <option value="" disabled>
                          Select a range…
                        </option>
                        <option value="Starter (1k–6k)">Starter (1k–6k)</option>
                        <option value="Business (3k–9k)">Business (3k–9k)</option>
                        <option value="Premium (6k–20k)">Premium (6k–20k)</option>
                        <option value="Not sure yet">Not sure yet</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-zinc-900" htmlFor="message">
                        What you need built
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        className={cn(
                          "w-full rounded-xl border bg-white px-3 py-2 text-sm leading-relaxed",
                          "focus:outline-none focus:ring-2 focus:ring-zinc-300"
                        )}
                        placeholder="Briefly describe the project, must-have features, and timeline."
                      />
                    </div>

                    <Button
                      className="mt-2 h-11 w-full ui-accent-cta"
                      type="submit"
                      disabled={!FORMSPREE_ACTION}
                      title={!FORMSPREE_ACTION ? "Set NEXT_PUBLIC_FORMSPREE_ENDPOINT" : undefined}
                    >
                      {FORMSPREE_ACTION ? "Submit inquiry" : "Set form endpoint"}
                    </Button>

                    <p className="text-xs text-zinc-500">
                      By submitting, you agree we may contact you about this request.
                    </p>
                  </form>

                  {BOOKING_URL ? (
                    <div className="rounded-2xl border bg-white p-4">
                      <div className="text-sm font-semibold text-zinc-900">Prefer to talk?</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        Book a quick intro call. We’ll confirm scope and recommend the right path.
                      </div>
                      <Button asChild variant="outline" className="mt-3 w-full rounded-2xl">
                        <a href={BOOKING_URL} target="_blank" rel="noreferrer">
                          Book a call
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border bg-white p-6">
                <div className="text-base font-semibold">What happens next</div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                  <li>• You’ll get an immediate confirmation email</li>
                  <li>• We’ll respond with next steps + an estimate range</li>
                  <li>• If needed, we’ll send a short intake checklist</li>
                </ul>

                <div className="mt-5 rounded-xl bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-900">Tip</div>
                  <div className="mt-1 text-sm text-zinc-600">
                    If you already have a site, include the URL and what you want to improve.
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
