<p align="center">
  <a href="https://icons.evora.dev" target="_blank" rel="noopener">
    <img src="https://icons.evora.dev/logo.svg" alt="Evora Icons" height="84" />
  </a>
</p>

# @evora-ui/icons-vue

[![Website](https://img.shields.io/badge/website-icons.evora.dev-2ea44f?logo=vercel&logoColor=white)](https://icons.evora.dev)
[![Docs](https://img.shields.io/badge/docs-get%20started-0ea5e9?logo=readthedocs&logoColor=white)](https://icons.evora.dev/guide/getting-started)
[![npm](https://img.shields.io/npm/v/%40evora-ui%2Ficons-vue.svg?logo=npm&label=%40evora-ui%2Ficons-vue)](https://www.npmjs.com/package/@evora-ui/icons-vue)
[![CI](https://github.com/evora-ui/evora-icons/actions/workflows/ci.yml/badge.svg)](https://github.com/evora-ui/evora-icons/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/evora-ui/evora-icons/blob/main/LICENSE)

Vue 3 icon components — 1500+ free SVG icons in line and filled variants. Open‑source, typed, tree‑shakable, SSR/CSP‑friendly.

- Website: https://icons.evora.dev
- Browse icons: https://icons.evora.dev/icons
- Getting started: https://icons.evora.dev/guide/getting-started
- Usage & API: https://icons.evora.dev/guide/usage
- SSR & CSP: https://icons.evora.dev/guide/ssr

## Install

```bash
yarn add @evora-ui/icons-vue
# or
npm i @evora-ui/icons-vue
```

## Quick Start

1) Flat imports (recommended)

```ts
import { EvUser, EvUserFilled } from '@evora-ui/icons-vue/icons'
```

```vue
<EvUser />
<EvUserFilled />
```

2) Global <EvIcon /> via provide (flat names)

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import { createEvoraIcons } from '@evora-ui/icons-vue'
import { EvUser, EvUserFilled } from '@evora-ui/icons-vue/icons'

createApp(App)
  .use(createEvoraIcons({
    icons: {
      'user': EvUser,
      'user-filled': EvUserFilled,
    }
  }))
  .mount('#app')
```

```vue
<EvIcon name="user" />
<EvIcon name="user-filled" color="#222" />
```

3) Direct per‑icon imports

```ts
import { EvUser, EvUserFilled } from '@evora-ui/icons-vue/icons'
```

```vue
<EvUser />            <!-- line variant -->
<EvUserFilled color="#ccc" />      <!-- filled variant -->
```

4) Variant components

```ts
import { EvChat, EvChatFilled } from '@evora-ui/icons-vue/icons'
```
- `EvChat` — line variant.
- `EvChatFilled` — filled variant.

## EvIcon Props
- `name`: string — icon name (strict union of generated names)
- `size`: number | string | token — default `32` (pixels)
  - tokens: `xs`(12), `sm`(16), `md`(24), `lg`(32), `xl`(40), `2xl`(48), `3xl`(56)
- `color`: string — any CSS color; defaults to `currentColor`
- `ariaLabel?`: string — accessible name; if omitted, icon is `aria-hidden`

Additional attributes are forwarded to the underlying SVG (e.g. `stroke-width`, `stroke-linecap`).

Accessibility:
- Without `ariaLabel`, icons render with `aria-hidden`.
- Pass `ariaLabel` for an accessible name, or forward `title`/`aria-*`.

## Tips
- Provide only what you use — the bundle will contain just those icons.
- Set `size="1em"` to inherit font size; use `color` or rely on `currentColor`.
- In dev, if an icon is not found in the provided map, EvIcon warns and renders nothing.

## Per‑icon component props
- `size`, `stroke`, `strokeWidth`, `linecap`, `linejoin`, `ariaLabel` — same as `EvIcon`.
- `color` — the primary way to set color; internally maps to root `fill`.
- `fill` — legacy alias; if both provided, `color` wins.

## Sizing
- Pass a number (pixels), a CSS size string, or a token.
- Examples: `size={32}`, `size="24"`, `size="24px"`, `size="1em"`, `size="md"`.

## Names
- Icon names are kebab‑case:
  - line variant: `address-book`
  - filled variant: `address-book-filled`
- TypeScript helpers:
  - `import { ICON_NAMES, type IconName } from '@evora-ui/icons-vue/icons/names'`.
  - Use `IconName` for strict typing of the `EvIcon` `name` prop.

## Performance
- Prefer direct imports of explicit filled variants when you know the variant: `import { EvUserFilled } from '@evora-ui/icons-vue/icons'` — smallest bundles when you need filled.
- `@evora-ui/icons-vue/icons` exports both default and explicit variants; tree‑shaking drops unused ones.
- `EvIcon` is convenient for app‑wide provide; in hot paths prefer direct components.

## CSP / SSR
- Icons ship as render modules using static VNodes by default (no innerHTML) for CSP‑friendly SSR.
- Building from sources? The generator supports:
  - `--static-vnode` / `STATIC_VNODE=1` to enforce static VNodes
  - `--no-static-vnode` / `STATIC_VNODE=0` to use innerHTML
  - `--force-root-stroke` / `FORCE_ROOT_STROKE=1` to strip per-node stroke attributes for line icons so stroke can be driven from the root `<svg>` (useful for consistent theming). Note: defaults off and affects only `icons/line`.

Nuxt 3 (SSR) example:

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

SSR notes:
- Static render is used by default — no innerHTML — avoids hydration issues and is CSP‑friendly.
- Do not use `--no-static-vnode` when building for SSR.

## Troubleshooting
- Nothing renders: ensure you provided the icon (or import the per‑icon component directly).
- Wrong `name`: check the generated union (TypeScript will help) and the exact key used in provide.
- Variant mismatch: if you only provided `line`, `variant="filled"` won’t resolve.

IDE hints (Volar):
- Package includes global types for `<EvIcon>`, so tag and `name` autocompletion work out of the box.
- It’s recommended to enable Take Over Mode in Volar and restart TS Server after installing/updating the package.

## Links
- Website: https://icons.evora.dev
- Browse icons: https://icons.evora.dev/icons
- Getting started: https://icons.evora.dev/guide/getting-started
- Usage & API: https://icons.evora.dev/guide/usage
- SSR & CSP: https://icons.evora.dev/guide/ssr
- Changelog: https://github.com/evora-ui/evora-icons/blob/main/packages/vue/CHANGELOG.md

## Categories data
- This package doesn’t ship categories JSON. If you work in this monorepo, generated categories live under the repo root `categories/`.
- Each icon entry explicitly includes both flags: `{ line: true|false, filled: true|false }`.

## License
- Code: MIT (see LICENSE)
- Some SVG icons are derived from the Palm UI icon library (CC BY 4.0). See NOTICE and https://creativecommons.org/licenses/by/4.0/
