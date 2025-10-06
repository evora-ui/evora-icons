import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import * as Icons from "@evora-ui/icons-vue/icons";
import { ICON_NAMES } from "@evora-ui/icons-vue/icons/names";

export type Variant = "line" | "filled";

export function useIconsGallery() {
  const variant = ref<Variant>("line");
  const size = ref<number | string>(28);
  const color = ref<string>("");
  const query = ref("");

  function toComponentName(name: string) {
    const isFilled = name.endsWith("-filled");
    const base = isFilled ? name.replace(/-filled$/i, "") : name;
    const SPECIAL: Record<string, string> = {
      // Arrow U-turn segments
      udown: "UDown",
      uleft: "ULeft",
      uright: "URight",
      uup: "UUp",
      // X variants and combinations
      xcircle: "XCircle",
      xsquare: "XSquare",
      xplain: "XPlain",
      xlogo: "XLogo",
      xeyes: "XEyes",
      // File language suffixes
      csharp: "CSharp",
      // Text H heading variants
      hone: "HOne",
      htwo: "HTwo",
      hthree: "HThree",
      hfour: "HFour",
      hfive: "HFive",
      hsix: "HSix",
      // Text T slash
      tslash: "TSlash",
    };

    const pas = base
      .split("-")
      .map((s) => {
        const lower = s.toLowerCase();
        if (lower in SPECIAL) return SPECIAL[lower];
        return s.charAt(0).toUpperCase() + s.slice(1);
      })
      .join("");

    return "Ev" + pas + (isFilled ? "Filled" : "");
  }

  function compFor(name: string) {
    return (Icons as any)[toComponentName(name)];
  }

  const ALL = ICON_NAMES as unknown as readonly string[];
  const ITEMS = computed(() => {
    const byVariant = (n: string) => (variant.value === "line" ? !n.endsWith("-filled") : n.endsWith("-filled"));
    const q = query.value.trim().toLowerCase();
    return ALL.filter(byVariant).filter((n) => (!q ? true : n.includes(q)));
  });

  function setVariant(v: Variant) {
    variant.value = v;
  }

  // Selection + snippets
  const selected = ref<string | null>(null);
  const isOpen = computed(() => !!selected.value);
  function open(name: string) {
    selected.value = name;
  }
  function close() {
    selected.value = null;
  }

  const selectedCompName = computed(() => (selected.value ? toComponentName(selected.value) : ""));
  const importSnippet = computed(() =>
    selected.value ? `import { ${selectedCompName.value} } from '@evora-ui/icons-vue/icons'` : "",
  );
  const usageSnippet = computed(() => (selected.value ? `<${selectedCompName.value} />` : ""));
  const evIconSnippet = computed(() => (selected.value ? `<EvIcon name=\"${selected.value}\" />` : ""));

  // Copy helpers are provided by a separate composable; here only keyboard handling
  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") close();
  }
  onMounted(() => window.addEventListener("keydown", onKeydown));
  onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));

  // derived size
  const resolvedSize = computed(() => {
    const s = size.value as any;
    const map = { xs: 12, sm: 16, md: 24, lg: 32, xl: 40, "2xl": 48, "3xl": 56 } as const;
    return typeof s === "string" && s in map ? (map as any)[s] : Number(s) || 28;
  });

  return {
    // basic controls
    variant,
    setVariant,
    size,
    color,
    query,
    // data
    ALL,
    ITEMS,
    compFor,
    toComponentName,
    // selection
    selected,
    isOpen,
    open,
    close,
    // snippets
    importSnippet,
    usageSnippet,
    evIconSnippet,
    selectedCompName,
    // derived
    resolvedSize,
  };
}
