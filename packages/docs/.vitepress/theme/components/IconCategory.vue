<script setup lang="ts">
import IconControls from "./IconControls.vue";
import { useIconsGallery } from "../composables/useIconsGallery";
import { useClipboardFeedback } from "../composables/useClipboard";
import { computed } from "vue";
import { EvCaretRight } from "@evora-ui/icons-vue/icons";

const props = defineProps<{ category: string }>();

const {
  variant,
  setVariant,
  size,
  color,
  query,
  compFor,
  selected,
  isOpen,
  open,
  close,
  importSnippet,
  usageSnippet,
  evIconSnippet,
  resolvedSize,
} = useIconsGallery();

// Load category data
const catModules = import.meta.glob("../../../../../categories/*.json", { eager: true }) as Record<string, any>;

function fileForKey(key: string): any | null {
  const target = `/${key}.json`;
  for (const [path, mod] of Object.entries(catModules)) {
    if (path.endsWith(target) && !path.endsWith("/index.json")) return (mod as any).default || mod;
  }
  return null;
}

function namesForCategory(key: string): string[] {
  const data = fileForKey(key) as Record<string, { line: boolean; filled: boolean }> | null;
  if (!data) return [];
  const q = query.value.trim().toLowerCase();
  const out: string[] = [];
  const entries = Object.entries(data);
  for (const [name, flags] of entries) {
    if (variant.value === "line") {
      if (flags.line) out.push(name);
    } else {
      if (flags.filled) out.push(`${name}-filled`);
    }
  }
  return out.filter((n) => (!q ? true : n.includes(q)));
}

const { copied, copy, liveMessage } = useClipboardFeedback(["name", "example", "evicon"]);

function prettyTitle(key: string): string {
  const words = key.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" & ");
}

const title = computed(() => prettyTitle(props.category));
</script>

<template>
  <div class="icon-all icon-category">
    <nav class="breadcrumbs" aria-label="Breadcrumbs">
      <a href="/">Home</a>
      <EvCaretRight class="crumb-icon" :size="12" aria-label="" />
      <a href="/icons">Icons</a>
      <EvCaretRight class="crumb-icon" :size="12" aria-label="" />
      <a href="/icons/categories">Categories</a>
      <EvCaretRight class="crumb-icon" :size="12" aria-label="" />
      <span aria-current="page">{{ title }}</span>
    </nav>

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
      <div v-for="name in namesForCategory(props.category)" :key="name" class="cell" :title="name" @click="open(name)">
        <component :is="compFor(name)" :size="resolvedSize" :color="color || undefined" aria-label="" />
        <div class="tooltip" aria-hidden="true">{{ name }}</div>
      </div>
    </div>

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
              <button
                class="copy-btn"
                :class="{ copied: copied.example }"
                @click="
                  copy(
                    `<script setup>\nimport { ${
                      selected && (importSnippet as any)
                        ? String(importSnippet)
                            .match(/\{([^}]+)\}/)?.[1]
                            .trim()
                        : ''
                    } } from '@evora-ui/icons-vue/icons';\n<\/script>\n\n<template>\n  <${selected && (usageSnippet as any) ? String(usageSnippet).replace(/[<>]/g, '') : ''} />\n<\/template>`,
                    'example',
                  )
                "
              >
                {{ copied.example ? "Copied" : "Copy" }}
              </button>
            </div>
            <pre><code>&lt;script setup&gt;
import { {{ (selected && (importSnippet as any)) ? String(importSnippet).match(/\{([^}]+)\}/)?.[1].trim() : '' }} } from '@evora-ui/icons-vue/icons';
&lt;/script&gt;

&lt;template&gt;
  {{ usageSnippet }}
&lt;/template&gt;</code></pre>
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
