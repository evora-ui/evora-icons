<script setup lang="ts">
import * as Icons from "@evora-ui/icons-vue/icons";

const props = withDefaults(
  defineProps<{
    names?: string | string[];
    size?: number;
  }>(),
  { size: 18 },
);

function toComponentName(name: string) {
  const isFilled = name.endsWith("-filled");
  const base = isFilled ? name.replace(/-filled$/i, "") : name;
  const pas = base
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return "Ev" + pas + (isFilled ? "Filled" : "");
}

function compFor(name: string) {
  return (Icons as any)[toComponentName(name)];
}

const list = Array.isArray(props.names)
  ? props.names
  : String(props.names || "user,chat,play,code,star")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
</script>

<template>
  <div class="icon-teaser" aria-hidden="true">
    <component v-for="(n, i) in list" :key="n + i" :is="compFor(n)" :size="props.size" class="it" />
  </div>
</template>

<style scoped>
.icon-teaser {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.it {
  opacity: 0;
  animation: teaser-in 0.38s ease forwards;
  transform: translateY(4px);
}

.it:nth-child(2) {
  animation-delay: 0.06s;
}

.it:nth-child(3) {
  animation-delay: 0.12s;
}

.it:nth-child(4) {
  animation-delay: 0.18s;
}

.it:nth-child(5) {
  animation-delay: 0.24s;
}

@keyframes teaser-in {
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
