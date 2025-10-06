---
title: "SSR & CSP Guide for Evora UI Icons"
head:
  - - meta
    - name: description
      content: Learn how to use Evora UI Icons in Server‑Side Rendering (SSR) environments like Nuxt and Next.js. Ensure your icons are CSP‑compliant and render perfectly on the server.
---

# Server‑Side Rendering (SSR) & CSP

## Defaults
- Icons render as static VNodes by default (no `innerHTML`).
- CSP‑friendly (no inline scripts) and hydration‑safe.

## Nuxt 3 example

```ts
// plugins/evora-icons.ts
import { defineNuxtPlugin } from '#app'
import { createEvoraIcons } from '@evora-ui/icons-vue'
import { EvUser, EvUserFilled } from '@evora-ui/icons-vue/icons'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createEvoraIcons({
    icons: { user: EvUser, 'user-filled': EvUserFilled },
  }))
})
```

```vue
<template>
  <EvIcon name="user" />
  <EvIcon name="user-filled" />
  <!-- Also works with direct components -->
  <EvUser />
  <EvUserFilled />
</template>
```

## Notes
- Do not disable static VNodes (`--no-static-vnode`) for SSR builds.
- Use `color` and `size` props; avoid mutating SVG internals in SSR.
