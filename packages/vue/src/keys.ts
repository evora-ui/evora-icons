import type { Component } from "vue";

export const EVORA_ICONS_KEY = "evora-icons" as const;

export type IconsProvideFlatMap = Record<string, Component>;
export type IconsProvideNestedMap = {
  line?: Record<string, Component>;
  filled?: Record<string, Component>;
};
export type IconsProvideMap = IconsProvideFlatMap | IconsProvideNestedMap;
