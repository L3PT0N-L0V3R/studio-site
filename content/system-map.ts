import type { LucideIcon } from "lucide-react";
import { Mail, Database, Workflow, BarChart3, ShieldCheck, Globe } from "lucide-react";

export type SystemNode = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tags: string[];
};

export const systemNodes: SystemNode[] = [
  {
    id: "site",
    title: "Website",
    subtitle: "fast, mobile-first, conversion-ready",
    icon: Globe,
    tags: ["SEO", "Performance", "Accessibility"],
  },
  {
    id: "forms",
    title: "Forms + Intake",
    subtitle: "lead capture + routing",
    icon: Mail,
    tags: ["Spam protection", "Validation", "Notifications"],
  },
  {
    id: "crm",
    title: "CRM",
    subtitle: "pipeline + customer context",
    icon: Database,
    tags: ["Stages", "Assignments", "History"],
  },
  {
    id: "automation",
    title: "Automations",
    subtitle: "reduce manual follow-ups",
    icon: Workflow,
    tags: ["Reminders", "Scheduling", "Tasks"],
  },
  {
    id: "reporting",
    title: "Reporting",
    subtitle: "visibility into what’s working",
    icon: BarChart3,
    tags: ["Events", "Funnels", "ROI"],
  },
  {
    id: "trust",
    title: "Trust Layer",
    subtitle: "security-first controls",
    icon: ShieldCheck,
    tags: ["HTTPS", "Least privilege", "Audit-ready"],
  },
];
