import { IntroGate } from "@/components/intro/intro-gate";
import { Hero } from "@/components/sections/hero";
import { FeaturedWork } from "@/components/sections/featured-work";
import { FlagshipScroll } from "@/components/sections/flagship-scroll";
import { Trust } from "@/components/sections/trust";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";
import { SystemMap } from "@/components/sections/system-map";
import { CaseStudy } from "@/components/sections/case-study";


export default function Page() {
  return (
    <main>
      <IntroGate />
      <Hero />
      <FeaturedWork />
      <CaseStudy />
      <FlagshipScroll />

      <Trust
        eyebrow="Security posture"
        headline="Security-first builds with compliance-ready foundations*"
        highlight={["Security-first", "compliance-ready"]}
        copy="We implement modern security defaults and document the system boundary. For regulated environments, we scope requirements properly (what’s in/out), align controls, and support audits—without making misleading certification claims."
        items={[
          { label: "HIPAA-ready", sublabel: "scoped safeguards" },
          { label: "HITRUST-aligned", sublabel: "control mapping" },
          { label: "PCI-aware", sublabel: "Stripe/Shopify flows" },
          { label: "Audit-ready", sublabel: "logs + traceability" },
        ]}
      />
      <SystemMap />
      <Services />
      <Process />
      <Contact />
    </main>
  );
}
