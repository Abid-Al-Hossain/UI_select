"use client";

import { SectionCard } from "@/components/shared/layout/SectionCard";
import Slider from "@/components/shared/input/Slider";
import type { SelectStudioState } from "../types";

type Props = {
  state: SelectStudioState;
  update: <K extends keyof SelectStudioState>(key: K, value: SelectStudioState[K]) => void;
};

export default function RadiusSection({ state, update }: Props) {
  return (
    <SectionCard title="Radius" subtitle="Radius controls that are native, preview-honest, and React-export-honest.">
      <Slider label="Radius" value={state.radius} min={0} max={48} step={1} onChange={(value) => update("radius", value)} />
    </SectionCard>
  );
}
