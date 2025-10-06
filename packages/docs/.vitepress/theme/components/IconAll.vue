<script setup lang="ts">
import { useIconsGallery } from "../composables/useIconsGallery";
import { useClipboardFeedback } from "../composables/useClipboard";
import IconControls from "./IconControls.vue";
import { ref, computed, onMounted, watch } from "vue";

const {
  variant,
  setVariant,
  size,
  color,
  query,
  ITEMS,
  compFor,
  selected,
  isOpen,
  open,
  close,
  importSnippet,
  usageSnippet,
  evIconSnippet,
  selectedCompName,
  resolvedSize,
} = useIconsGallery();

const { copied, copy, liveMessage } = useClipboardFeedback(["name", "example", "evicon"]);

// Progressive render to improve TTI on large lists
const displayCount = ref(240);
const step = 240;
const VISIBLE = computed(() => ITEMS.value.slice(0, displayCount.value));
let growTimer: number | null = null;
function scheduleGrow() {
  if (growTimer) return;
  const tick = () => {
    if (displayCount.value < ITEMS.value.length) {
      displayCount.value = Math.min(displayCount.value + step, ITEMS.value.length);
      growTimer = window.requestIdleCallback
        ? (window.requestIdleCallback(tick) as unknown as number)
        : window.setTimeout(tick, 50);
    } else {
      if (growTimer) {
        window.cancelIdleCallback?.(growTimer as any);
        clearTimeout(growTimer as any);
        growTimer = null;
      }
    }
  };
  growTimer = window.requestIdleCallback
    ? (window.requestIdleCallback(tick) as unknown as number)
    : window.setTimeout(tick, 50);
}

onMounted(() => scheduleGrow());
watch([ITEMS, variant], () => {
  displayCount.value = Math.min(step, ITEMS.value.length);
  growTimer && (clearTimeout(growTimer as any), window.cancelIdleCallback?.(growTimer as any), (growTimer = null));
  scheduleGrow();
});

const exampleSnippet = computed(() => {
  if (!selected.value) return "";
  const comp = selectedCompName.value || "";
  return `<script setup>\nimport { ${comp} } from '@evora-ui/icons-vue/icons';\n<\/script>\n\n<template>\n  <${comp} />\n<\/template>`;
});
</script>

<template>
  <div class="icon-all">
    <IconControls
      :variant="variant"
      :query="query"
      :size="size"
      :color="color"
      @update:variant="setVariant"
      @update:query="(v) => (query = v)"
      @update:size="(v) => (size = v)"
      @update:color="(v) => (color = v)"
    />

    <div class="grid" :style="{ '--icon-size': resolvedSize + 'px' }">
      <div v-for="name in VISIBLE" :key="name" class="cell" :title="name" @click="open(name)">
        <component :is="compFor(name)" :size="resolvedSize" :color="color || undefined" aria-label="" />
        <div class="tooltip" aria-hidden="true">{{ name }}</div>
      </div>
    </div>

    <!-- Bottom fixed drawer -->
    <div class="drawer" :class="{ open: isOpen }" role="dialog" aria-modal="false" v-show="isOpen">
      <div class="drawer-inner">
        <div class="drawer-header">
          <div class="title">
            <span class="chip">{{ selected }}</span>
          </div>
          <div class="spacer" />
          <button
            class="icon-btn"
            :class="{ copied: copied.name }"
            aria-label="Copy name"
            @click="copy(selected || '', 'name')"
          >
            {{ copied.name ? "Copied" : "Copy name" }}
          </button>
          <button class="icon-btn" aria-label="Close" @click="close">Close</button>
        </div>
        <div class="drawer-content">
          <div class="snippet editor">
            <div class="snippet-head">
              <div class="traffic">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span class="filename">App.vue</span>
              <button class="copy-btn" :class="{ copied: copied.example }" @click="copy(exampleSnippet, 'example')">
                {{ copied.example ? "Copied" : "Copy" }}
              </button>
            </div>
            <pre><code>{{ exampleSnippet }}</code></pre>
          </div>
          <div class="snippet">
            <div class="snippet-head">
              <span>Usage with EvIcon</span>
              <button class="copy-btn" :class="{ copied: copied.evicon }" @click="copy(evIconSnippet, 'evicon')">
                {{ copied.evicon ? "Copied" : "Copy" }}
              </button>
            </div>
            <pre><code>{{ evIconSnippet }}</code></pre>
          </div>
        </div>
        <div class="sr-only" aria-live="polite">{{ liveMessage }}</div>
      </div>
    </div>
  </div>
</template>
