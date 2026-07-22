import {
  AbsoluteBars,
  RelativeBars,
} from "@/components/figures/perception-bars";
import { Plate, PlateCaption } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs } from "@/components/ui/tabs";
import { sectionIds } from "@/lib/constants";
import {
  multiplierCaption,
  multiplierOpener,
  perceptionPanelLabel,
} from "@/lib/content";

/** Chapter 04 — the multiplier: perception read absolute, then relative. */
export function MultiplierSection() {
  return (
    <Chapter id={sectionIds.multiplier}>
      <SectionHeader opener={multiplierOpener} />

      <Reveal as="figure" className="fig-plate draw-bars">
        <Plate>
          <Tabs
            ariaLabel="Perception read"
            tabBarClassName="plate-tab-bar"
            appendix={
              <span className="panel-label">{perceptionPanelLabel}</span>
            }
            items={[
              { id: "panelAbs", label: "Absolute", content: <AbsoluteBars /> },
              { id: "panelRel", label: "Relative", content: <RelativeBars /> },
            ]}
          />
        </Plate>
        <PlateCaption>
          <strong>{multiplierCaption.strong}</strong>
          {multiplierCaption.rest}
        </PlateCaption>
      </Reveal>
    </Chapter>
  );
}
