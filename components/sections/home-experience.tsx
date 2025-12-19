"use client";
import type React from "react";

import { useMemo } from "react";
import { useSitePreferences } from "@/components/providers/site-preferences";

import { Hero } from "@/components/sections/hero";
import { FeaturedWork } from "@/components/sections/featured-work";
import { FlagshipScroll } from "@/components/sections/flagship-scroll";
import { Trust } from "@/components/sections/trust";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Contact } from "@/components/sections/contact";
import SystemMap from "@/components/sections/system-map";
import { CaseStudy } from "@/components/sections/case-study";

type Key =
  | "hero"
  | "clicks"
  | "caseStudy"
  | "flagship"
  | "trust"
  | "systemMap"
  | "services"
  | "process"
  | "contact";

const ORDER: Record<string, Key[]> = {
  design: ["hero", "caseStudy", "flagship", "clicks", "process", "trust", "services", "systemMap", "contact"],
  performance: ["hero", "trust", "systemMap", "process", "caseStudy", "flagship", "clicks", "services", "contact"],
  conversion: ["hero", "clicks", "services", "caseStudy", "process", "trust", "systemMap", "flagship", "contact"],
  default: ["hero", "clicks", "caseStudy", "flagship", "trust", "systemMap", "services", "process", "contact"],
};

type Registry = Record<Key, () => React.ReactElement>;


export function HomeExperience() {
  const { focus } = useSitePreferences();

  const registry: Registry = useMemo(
    () => ({
      hero: () => <Hero />,
      clicks: () => <FeaturedWork />,
      caseStudy: () => <CaseStudy />,
      flagship: () => <FlagshipScroll />,
      trust: () => (
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
      ),
      systemMap: () => <SystemMap />,
      services: () => <Services />,
      process: () => <Process />,
      contact: () => <Contact />,
    }),
    []
  );

  const keys = focus ? ORDER[focus] : ORDER.default;

  return (
    <>
      {keys.map((k) => {
        const Section = registry[k];
        return <Section key={k} />;
      })}
    </>
  );
}
