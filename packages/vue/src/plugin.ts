import type { App, Component } from "vue";
import EvIcon from "./EvIcon";
import { EVORA_ICONS_KEY } from "./keys";

export type EvoraIconsMap = Record<string, Component>;

export function createEvoraIcons(options: { icons?: EvoraIconsMap } = {}) {
  return {
    install(app: App) {
      if (options.icons) {
        app.provide(EVORA_ICONS_KEY, options.icons);
      }
      app.component("EvIcon", EvIcon);
    },
  };
}

export { default as EvIcon } from "./EvIcon";
