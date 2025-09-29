# @evora-ui/icons-vue

Vue 3 icon components — 1500+ free icons in two variants: line and filled.

- Tree‑shakable per‑icon imports
- Typed names and props (great DX)
- CSP/SSR‑friendly render modules

## Install

```bash
yarn add @evora-ui/icons-vue
# or
npm i @evora-ui/icons-vue
```

## Usage

1) EvIcon + provide (recommended)

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import createEvoraIcons, { createEvoraIcons as namedCreate } from '@evora-ui/icons-vue'
import { EvUser } from '@evora-ui/icons-vue/icons/line'
import { EvUser as EvUserFilled } from '@evora-ui/icons-vue/icons/filled'

createApp(App)
  .use(createEvoraIcons({ 
    icons: { 
        line: { user: EvUser }, 
        filled: { user: EvUserFilled } 
    } 
  }))
  .mount('#app')
```

```vue
<EvIcon name="user" />
<EvIcon name="user" variant="filled" color="#222" />
```

2) Direct per‑icon imports

```ts
import { EvUser } from '@evora-ui/icons-vue/icons'
// Or explicit variants:
import { EvUser as EvUserLine } from '@evora-ui/icons-vue/icons/line'
import { EvUser as EvUserFilled } from '@evora-ui/icons-vue/icons/filled'
```

```vue
<EvUser />            <!-- default (line) variant -->
<EvUserLine />        <!-- explicit line variant -->
<EvUserFilled />      <!-- explicit filled variant -->
```

3) Combined icons entry (facade and variant components)

```ts
import { EvChat, EvChatLine, EvChatFilled } from '@evora-ui/icons-vue/icons'
```
- `EvChat` is a synchronous facade that switches by its `variant` prop.
- `EvChatLine` and `EvChatFilled` are explicit variant components (tightest bundles when you know the variant).

```vue
<!-- Facade chooses the variant at render time -->
<EvChat />
<EvChat variant="filled" />

<!-- Explicit‑variant components -->
<EvChatLine />
<EvChatFilled />
```

## EvIcon Props
- `name`: string — icon name (strictly typed union of generated names)
- `variant`: 'line' | 'filled' — visual style, default `line`
- `size`: number | string | token — default `32` (pixels)
  - tokens: `xs`(12), `sm`(16), `md`(24), `lg`(32), `xl`(40), `2xl`(48), `3xl`(56)
- `color`: string — any CSS color; defaults to `currentColor`
- `ariaLabel?`: string — accessible name; if omitted, icon is `aria-hidden`

Additional attributes are forwarded to the underlying SVG (e.g. `stroke-width`, `stroke-linecap`).

## Tips
- Provide only what you use — the bundle will contain just those icons.
- Set `size="1em"` to inherit font size; use `color` or rely on `currentColor`.
- In dev, if an icon is not found in the provided map, EvIcon warns and renders nothing.

## Sizing
- Pass a number (pixels), a CSS size string, or a token.
- Examples: `size={32}`, `size="24"`, `size="24px"`, `size="1em"`, `size="md"`.

## Names
- Icon names are kebab‑case (lowercase with dashes): e.g. `address-book`, `air-traffic-control`.
- TypeScript helpers:
  - `import { ICON_NAMES, type IconName } from '@evora-ui/icons-vue/icons/names'`.
  - Use `IconName` for strict typing of `EvIcon`'s `name` prop.

## Performance
- Prefer direct imports from `icons/line` or `icons/filled` when you know the variant — smallest bundles.
- The combined `@evora-ui/icons-vue/icons` entry is convenient but includes variant aliases too.
- `EvIcon` is great for app‑wide provide; for hot paths prefer direct components.

## CSP / SSR
- Icons ship as render modules using static VNodes by default (no innerHTML) for CSP‑friendly SSR.
- Building from sources? The generator supports:
  - `--static-vnode` / `STATIC_VNODE=1` to enforce static VNodes
  - `--no-static-vnode` / `STATIC_VNODE=0` to use innerHTML

## Troubleshooting
- Nothing renders: ensure you provided the icon (or import the per‑icon component directly).
- Wrong `name`: check the generated union (TypeScript will help) and the exact key used in provide.
- Variant mismatch: if you only provided `line`, `variant="filled"` won’t resolve.

## Categories data
- This package doesn’t ship categories JSON. If you work in this monorepo, generated categories live under the repo root `categories/`.
- Each icon entry explicitly includes both flags: `{ line: true|false, filled: true|false }`.

## License
- Code: MIT (see LICENSE)
- Some SVG icons are derived from the Palm UI icon library (CC BY 4.0). See NOTICE and https://creativecommons.org/licenses/by/4.0/
