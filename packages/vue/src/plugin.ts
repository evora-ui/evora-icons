import type { App, Component } from "vue";
import EvIcon from "./EvIcon";
import { EVORA_ICONS_KEY } from "./keys";

export type EvoraIconsMap = Record<string, Component>;

function pascalToKebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])(\d)/g, "$1-$2")
    .replace(/(\d)([A-Za-z])/g, "$1-$2")
    .toLowerCase();
}

// Public normalization: from EvName/EvNameFilled or kebab to kebab (optionally -filled)
export function normalizeIconKey(key: string): string {
  const raw = key.trim();
  if (raw.includes("-")) return raw.toLowerCase();
  let base = raw;
  if (base.startsWith("Ev")) base = base.slice(2);
  let isFilled = false;
  if (base.endsWith("Filled")) {
    isFilled = true;
    base = base.slice(0, -"Filled".length);
  }
  const kebab = pascalToKebab(base);
  return isFilled ? `${kebab}-filled` : kebab;
}

// Internal normalization with optional fallback to component name
function normalizeIconKeyWithComp(key: string, comp?: Component): string {
  // If already kebab (possibly with -filled), trust it
  const raw = key.trim();
  if (raw.includes("-")) return raw.toLowerCase();
  // Prefer explicit key parsing (EvName / EvNameFilled)
  let base = raw;
  if (base.startsWith("Ev")) base = base.slice(2);
  let isFilled = false;
  if (base.endsWith("Filled")) {
    isFilled = true;
    base = base.slice(0, -"Filled".length);
  }
  let kebab = pascalToKebab(base);
  // Fallback to component name if needed
  if (!kebab && comp && (comp as any).name) {
    let name = String((comp as any).name);
    if (name.startsWith("Ev")) name = name.slice(2);
    if (name.endsWith("Filled")) {
      isFilled = true;
      name = name.slice(0, -"Filled".length);
    }
    kebab = pascalToKebab(name);
  }
  return isFilled ? `${kebab}-filled` : kebab;
}

export function createEvoraIcons(options: { icons?: EvoraIconsMap } = {}) {
  return {
    install(app: App) {
      if (options.icons) {
        const map: Record<string, Component> = {};
        for (const [k, v] of Object.entries(options.icons)) {
          map[normalizeIconKeyWithComp(k, v)] = v;
        }
        app.provide(EVORA_ICONS_KEY, map);
      }
      app.component("EvIcon", EvIcon);
    },
  };
}

export { default as EvIcon } from "./EvIcon";
