import { ref, onBeforeUnmount } from "vue";

export function useClipboardFeedback(keys: readonly string[] = []) {
  const copied = ref<Record<string, boolean>>({});
  const liveMessage = ref("");
  let timer: number | undefined;

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      copied.value = { ...copied.value, [key]: true };
      liveMessage.value = "Copied to clipboard";
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (key in copied.value) copied.value = { ...copied.value, [key]: false };
        liveMessage.value = "";
      }, 1500);
    } catch {
      // noop
    }
  }

  onBeforeUnmount(() => {
    if (timer) clearTimeout(timer);
  });

  // ensure default keys are present
  if (keys.length) {
    const base: Record<string, boolean> = {};
    for (const k of keys) base[k] = false;
    copied.value = base;
  }

  return { copied, copy, liveMessage };
}
