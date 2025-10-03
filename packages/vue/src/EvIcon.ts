import { computed, defineComponent, h, inject } from "vue";
import type { Component, PropType } from "vue";
import { EVORA_ICONS_KEY, type IconsProvideMap } from "./keys";
import type { IconName as GeneratedIconName } from "./icons/names";

type SizeToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export default defineComponent({
  name: "EvIcon",
  props: {
    name: { type: String as PropType<GeneratedIconName>, required: true },
    size: { type: [Number, String] as PropType<number | string | SizeToken>, default: 32 },
    color: { type: String as PropType<string | undefined>, default: undefined },
    ariaLabel: { type: String as PropType<string | undefined>, default: undefined },
  },
  setup(props, { attrs }) {
    const sizeMap: Record<SizeToken, number> = {
      xs: 12,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 40,
      "2xl": 48,
      "3xl": 56,
    };
    const resolvedSize = computed(() => {
      const s = props.size as any;
      if (typeof s === "string" && s in sizeMap) return sizeMap[s as SizeToken];
      return s;
    });
    const evoraIcons = inject(EVORA_ICONS_KEY);

    const findProvided = (name: string): Component | undefined => {
      const key = name.trim();
      const lower = key.toLowerCase();
      if (!evoraIcons) return undefined;
      const flat = evoraIcons as unknown as Record<string, Component>;
      if (flat[lower]) return flat[lower];
      if (flat[key]) return flat[key];
      return undefined;
    };

    const Resolved = computed<Component>(() => {
      const c = findProvided(props.name);
      if (c) return c;
      if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
        console.warn(`[evora-icons] Icon not provided: name="${String(props.name)}".`);
      }
      return defineComponent({ name: "EvoraEmpty", render: () => null }) as unknown as Component;
    });

    const fwd: Record<string, any> = { size: resolvedSize.value, ariaLabel: props.ariaLabel };
    if (props.color) fwd.fill = props.color;

    return () => h(Resolved.value, { ...(attrs as any), ...fwd });
  },
});
