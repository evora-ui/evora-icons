import type { Component, InjectionKey } from "vue";

export type IconsProvideMap = Record<string, Component>;

export const EVORA_ICONS_KEY: InjectionKey<IconsProvideMap> = Symbol("evora-icons");
