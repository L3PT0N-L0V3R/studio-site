import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FadeIn } from "@/components/motion/fade-in";

export function Contact() {
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
                  <div className="text-sm text-zinc-600">Form wiring comes next.</div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-zinc-600">
                  <div>• Name</div>
                  <div>• Email</div>
                  <div>• Budget range</div>
                  <div>• What you need built</div>
                  <Button className="mt-4 w-full" disabled>
                    Submit (next step)
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <FadeIn delay={0.1}>
              <div className="rounded-2xl border bg-white p-6">
                <div className="text-base font-semibold">What we’ll add next</div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                  <li>• Real form + email delivery (Resend)</li>
                  <li>• Calendar booking link</li>
                  <li>• Case study pages</li>
                  <li>• Flagship scroll sequence</li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </Container>
    </section>
  );
}
