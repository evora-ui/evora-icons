---
title: "Usage & API Reference | Evora UI Icons"
head:
  - - meta
    - name: description
      content: Learn how to import and customize Evora UI Icons in your project. Full API documentation for props like size, color, stroke-width, and more.
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "Customize Evora UI Icons",
        "step": [
          {"@type":"HowToStep","name":"Import","text":"import { EvUser } from '@evora-ui/icons-vue/icons'"},
          {"@type":"HowToStep","name":"Set size","text":"<EvUser size='24' />"},
          {"@type":"HowToStep","name":"Set color","text":"<EvUser color='#111' />"}
        ]
      }
---

# Usage & API Reference

## EvIcon props
- `name`: string — icon name (strict union of generated names)
- `size`: number | string | token — default `32` (pixels)
  - tokens: `xs`(12), `sm`(16), `md`(24), `lg`(32), `xl`(40), `2xl`(48), `3xl`(56)
- `color`: string — any CSS color; defaults to `currentColor`
- `ariaLabel?`: string — accessible name; if omitted, icon is `aria-hidden`

Additional attributes are forwarded to the underlying SVG (e.g. `stroke-width`, `stroke-linecap`).

## Per‑icon component props
- `size`, `stroke`, `strokeWidth`, `linecap`, `linejoin`, `ariaLabel` — same as `EvIcon`.
- `color` — the primary way to set color; internally maps to root `fill`.
- `fill` — legacy alias; if both provided, `color` wins.

## Names & types
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
