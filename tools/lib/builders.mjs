export function buildVueComponent(name, inner) {
  return `\
<template>\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    :width=\"resolvedSize\"\n    :height=\"resolvedSize\"\n    viewBox=\"0 0 32 32\"\n    :fill=\"fill\"\n    :stroke=\"stroke\"\n    :stroke-width=\"strokeWidth\"\n    :stroke-linecap=\"linecap\"\n    :stroke-linejoin=\"linejoin\"\n    :aria-label=\"ariaLabel\"\n    :aria-hidden=\"ariaLabel ? undefined : true\"\n    role=\"img\"\n  >\n${inner}\n  </svg>\n</template>\n\n<script setup lang=\"ts\">\nimport { computed } from 'vue'\n\n type SizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'\n const sizeMap: Record<SizeToken, number> = { xs: 12, sm: 16, md: 24, lg: 32, xl: 40, '2xl': 48, '3xl': 56 }\n\n const props = withDefaults(defineProps<{\n   size?: number | string | SizeToken\n   stroke?: string\n   fill?: string\n   strokeWidth?: number | string\n   linecap?: 'round' | 'square' | 'butt'\n   linejoin?: 'round' | 'bevel' | 'miter'\n   ariaLabel?: string\n }>(), { size: 32, stroke: 'none', fill: 'currentColor', strokeWidth: 1, linecap: 'round', linejoin: 'round' })\n\n const resolvedSize = computed(() => {\n   const s = props.size as any\n   return typeof s === 'string' && (s in sizeMap) ? sizeMap[s as SizeToken] : s\n })\n</script>\n`;
}

export function buildTsRenderComponent(name, inner) {
  const wrapped = `<g>\n${inner}\n</g>`;
  const innerJSON = JSON.stringify(wrapped);
  return `import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'Ev${name}',
  props: {
    size: { type: [Number, String], default: 32 },
    stroke: { type: String, default: 'none' },
    fill: { type: String, default: 'currentColor' },
    color: { type: String, default: undefined },
    strokeWidth: { type: [Number, String], default: 1 },
    linecap: { type: String, default: 'round' },
    linejoin: { type: String, default: 'round' },
    ariaLabel: { type: String, default: undefined },
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: (({xs:12,sm:16,md:24,lg:32,xl:40,'2xl':48,'3xl':56} as any)[props.size as any] ?? props.size) as any,
      height: (({xs:12,sm:16,md:24,lg:32,xl:40,'2xl':48,'3xl':56} as any)[props.size as any] ?? props.size) as any,
      viewBox: '0 0 32 32',
      fill: (props.color ?? props.fill),
      stroke: props.stroke,
      'stroke-width': props.strokeWidth as any,
      'stroke-linecap': props.linecap as any,
      'stroke-linejoin': props.linejoin as any,
      'aria-label': props.ariaLabel,
      'aria-hidden': props.ariaLabel ? undefined : true,
      role: 'img',
      innerHTML: ${innerJSON},
    })
  }
})
`;
}

export function buildTsRenderComponentStatic(name, inner) {
  const wrapped = `<g>\n${inner}\n</g>`;
  const innerJSON = JSON.stringify(wrapped);
  return `import { defineComponent, h, createStaticVNode } from 'vue'\nexport default defineComponent({\n  name: 'Ev${name}',\n  props: {\n    size: { type: [Number, String], default: 32 },\n    stroke: { type: String, default: 'none' },\n    fill: { type: String, default: 'currentColor' },\n    color: { type: String, default: undefined },\n    strokeWidth: { type: [Number, String], default: 1 },\n    linecap: { type: String, default: 'round' },\n    linejoin: { type: String, default: 'round' },\n    ariaLabel: { type: String, default: undefined },\n  },\n  setup(props) {\n    const sizeMap = { xs: 12, sm: 16, md: 24, lg: 32, xl: 40, '2xl': 48, '3xl': 56 } as const\n    const toPx = (s:any) => ((sizeMap as any)[s] ?? s)\n    return () => h('svg', {\n      xmlns: 'http://www.w3.org/2000/svg',\n      width: toPx(props.size) as any,\n      height: toPx(props.size) as any,\n      viewBox: '0 0 32 32',\n      fill: (props.color ?? props.fill),\n      stroke: props.stroke,\n      'stroke-width': props.strokeWidth as any,\n      'stroke-linecap': props.linecap as any,\n      'stroke-linejoin': props.linejoin as any,\n      'aria-label': props.ariaLabel,\n      'aria-hidden': props.ariaLabel ? undefined : true,\n      role: 'img',\n    }, [createStaticVNode(${innerJSON}, 1)])\n  }\n})\n`;
}
