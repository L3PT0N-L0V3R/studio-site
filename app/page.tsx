import { HomeExperience } from "@/components/sections/home-experience";
import { EntryGate } from "@/components/intro/entry-gate";

export default function Page() {
  return (
    <EntryGate holdMs={950} storageKey="studio_entered_v1">
      <HomeExperience />
    </EntryGate>
  );
}
