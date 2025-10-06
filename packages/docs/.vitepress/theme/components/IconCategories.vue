<script setup lang="ts">
import * as Icons from "@evora-ui/icons-vue/icons";
import catsIndex from "../../../../../categories/index.json" with { type: "json" };
const catModules = import.meta.glob("../../../../../categories/*.json", { eager: true }) as Record<string, any>;

function prettyTitle(key: string): string {
  const words = key.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1));
  return words.join(" & ");
}

function namesPreview(key: string, limit = 6): string[] {
  const target = `/${key}.json`;
  let data: any = null;
  for (const [path, mod] of Object.entries(catModules)) {
    if (path.endsWith(target) && !path.endsWith("/index.json")) {
      data = (mod as any).default || mod;
      break;
    }
  }
  if (!data) return [];
  const out: string[] = [];
  for (const name of Object.keys(data)) {
    if (data[name]?.line) out.push(name);
    if (out.length >= limit) break;
  }
  return out;
}

function toComponentName(name: string) {
  const pas = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return "Ev" + pas;
}
function compFor(name: string) {
  return (Icons as any)[toComponentName(name)];
}
</script>

<template>
  <div class="icon-all icon-categories">
    <div class="cats-grid">
      <a v-for="c in (catsIndex as any).categories" :key="c.key" class="cat-card" :href="`/icons/categories/${c.key}`">
        <div class="cat-head">
          <div class="cat-title">{{ prettyTitle(c.key) }}</div>
          <span class="badge">{{ c.count }} icons</span>
        </div>
        <div class="cat-preview">
          <component v-for="n in namesPreview(c.key, 6)" :key="n" :is="compFor(n)" :size="24" aria-label="" />
        </div>
      </a>
    </div>
  </div>
</template>
