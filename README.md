<p align="center">
  <a href="https://icons.evora.dev" target="_blank" rel="noopener">
    <img src="https://icons.evora.dev/logo.svg" alt="Evora Icons" height="84" />
  </a>
</p>

# Evora Icons

[![Website](https://img.shields.io/badge/website-icons.evora.dev-2ea44f?logo=vercel&logoColor=white)](https://icons.evora.dev)
[![Docs](https://img.shields.io/badge/docs-get%20started-0ea5e9?logo=readthedocs&logoColor=white)](https://icons.evora.dev/guide/getting-started)
[![npm](https://img.shields.io/npm/v/%40evora-ui%2Ficons-vue.svg?logo=npm&label=%40evora-ui%2Ficons-vue)](https://www.npmjs.com/package/@evora-ui/icons-vue)
[![CI](https://github.com/evora-ui/evora-icons/actions/workflows/ci.yml/badge.svg)](https://github.com/evora-ui/evora-icons/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

Evora Icons is a growing set of clean, consistent UI icons in two visual variants: line and filled. 1500+ free icons. Open source, typed, tree‑shakable, SSR/CSP‑friendly.

- Website: https://icons.evora.dev
- Browse icons: https://icons.evora.dev/icons
- Getting started: https://icons.evora.dev/guide/getting-started
- Usage & API: https://icons.evora.dev/guide/usage
- SSR & CSP: https://icons.evora.dev/guide/ssr
- npm: https://www.npmjs.com/package/@evora-ui/icons-vue

## Packages
- Vue (current): `@evora-ui/icons-vue` — see `packages/vue/README.md`
- React (soon): `@evora-ui/icons-react` is on the roadmap

## Features
- 1500+ icons in line and filled
- Flat per‑icon imports with excellent tree‑shaking
- Typed names and props, great IDE experience
- SSR/CSP‑safe rendering via `createStaticVNode`

## Development
- Icon sources live in `icons/{line,filled}/<Category>/Icon.svg`
- SVGs must have `viewBox="0 0 32 32"`
- Generate components:
  - From repo root: `yarn generate` (runs for all workspaces)
  - Or directly: `node tools/generate-icons.mjs --pkg packages/vue`
  - Flags:
    - `--static-vnode` / `STATIC_VNODE=1` — force static VNodes
    - `--no-static-vnode` / `STATIC_VNODE=0` — use innerHTML VNodes
    - `--force-root-stroke` / `FORCE_ROOT_STROKE=1` — strip per‑node stroke attributes in line icons to control stroke from the root `<svg>`

### Categories JSON
- The generator emits category manifests to `categories/`:
  - `categories/index.json` — list of categories
  - `categories/<category>.json` — icon map per category
- Category keys normalize `&` → `-`. Each icon entry explicitly includes both flags:
  - `{ line: true|false, filled: true|false }`

## Contributing
- Add or update SVGs under `icons/line` or `icons/filled`
- Ensure `viewBox="0 0 32 32"` and consistent strokes/fills (fills are removed by the generator)
- PRs are welcome!

## License
- Code: MIT (see `LICENSE`)

## Credits
Some icons in `@evora-ui/icons-vue` are adapted from the Palm UI icons library (CC BY 4.0). Attribution is included in this repository; you do not need to add it in your projects.
