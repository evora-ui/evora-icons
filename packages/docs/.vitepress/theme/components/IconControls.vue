<script setup lang="ts">
import { computed } from "vue";

type Variant = "line" | "filled";

const props = defineProps<{
  variant: Variant;
  query: string;
  size: number | string;
  color: string;
}>();

const emit = defineEmits<{
  (e: "update:variant", value: Variant): void;
  (e: "update:query", value: string): void;
  (e: "update:size", value: number | string): void;
  (e: "update:color", value: string): void;
}>();

function setVariant(v: Variant) {
  emit("update:variant", v);
}
function setQuery(v: string) {
  emit("update:query", v);
}
function setSize(v: number | string) {
  emit("update:size", v);
}
function setColor(v: string) {
  emit("update:color", v);
}

const sizeNumber = computed<number>({
  get() {
    return typeof props.size === "string" ? Number(props.size) || 28 : props.size;
  },
  set(v: number) {
    emit("update:size", v);
  },
});
</script>

<template>
  <div class="icon-controls" role="group" aria-label="Icons controls">
    <div class="ctrl-block segment" role="radiogroup" aria-label="Variant selector">
      <button
        type="button"
        class="seg-btn"
        :aria-pressed="props.variant === 'line'"
        :class="{ active: props.variant === 'line' }"
        @click="setVariant('line')"
      >
        Line
      </button>
      <button
        type="button"
        class="seg-btn"
        :aria-pressed="props.variant === 'filled'"
        :class="{ active: props.variant === 'filled' }"
        @click="setVariant('filled')"
      >
        Filled
      </button>
    </div>

    <div class="ctrl-block search-wrap" role="search">
      <input
        :value="props.query"
        @input="setQuery(($event.target as HTMLInputElement).value)"
        class="search"
        type="search"
        placeholder="Search icons…"
        aria-label="Search icons"
      />
      <button v-if="props.query" class="clear-btn" type="button" aria-label="Clear search" @click="setQuery('')">
        Clear
      </button>
    </div>

    <div class="ctrl-block control size-ctrl">
      <label class="lbl" for="icon-size">Size</label>
      <input
        id="icon-size"
        class="range"
        type="range"
        min="12"
        max="96"
        step="1"
        :value="sizeNumber"
        @input="sizeNumber = Number(($event.target as HTMLInputElement).value)"
      />
      <input
        class="num"
        type="number"
        min="8"
        max="128"
        step="1"
        :value="sizeNumber"
        @input="sizeNumber = Number(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="ctrl-block control color-ctrl">
      <label class="lbl" for="icon-color">Color</label>
      <input
        id="icon-color"
        class="color"
        type="color"
        :value="props.color || '#000000'"
        @input="setColor(($event.target as HTMLInputElement).value)"
      />
      <button class="clear-btn" type="button" aria-label="Reset color" @click="setColor('')">Reset</button>
    </div>
  </div>
</template>
