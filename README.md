# Evora Icons

Evora Icons is a growing set of clean, consistent UI icons in two visual variants: line and filled. 1500+ free icons, open source, framework‑friendly.

- Current package: `@evora-ui/icons-vue` (Vue 3)
- Source SVGs live in `icons/line` and `icons/filled`
- Some icons attribution is provided via `NOTICE`

## Packages
- Vue (now): see `packages/vue/README.md` for usage, props, and flat import patterns
- React (soon): `@evora/icons-react` is on the roadmap

## Development
- Icons are organized under `icons/{line,filled}/<Category>/Icon.svg`
- SVGs must have `viewBox="0 0 32 32"`
- Run generator:
  - From repo root: `yarn generate` (runs per workspace)
  - Or directly: `node tools/generate-icons.mjs --pkg packages/vue`
  - Flags:
    - `--static-vnode` / `STATIC_VNODE=1` — force static VNodes
    - `--no-static-vnode` / `STATIC_VNODE=0` — allow innerHTML VNodes
    - `--force-root-stroke` / `FORCE_ROOT_STROKE=1` — for line sets, strip stroke attributes from child nodes to let root `stroke`/`stroke-width` control appearance (off by default)

### Categories JSON
- The generator emits category manifests to the repo root at `categories/`:
  - `categories/index.json` — list of categories
  - `categories/<category>.json` — icon map per category
- Category keys normalize `&` to `-`, and every icon entry explicitly has both flags:
  - `{ line: true|false, filled: true|false }`

## Contributing
- Add or update SVGs under `icons/line` or `icons/filled`
- Ensure `viewBox="0 0 32 32"` and consistent strokes/fills (fills are stripped by the generator)
- Open a PR—thanks for contributing!

## License
- Code: MIT (see `LICENSE`)

## Credits
Some icons in `@evora-ui/icons-vue` are adapted from the Palm UI icons library.
Used under CC BY 4.0.
Attribution is already included within this repository —
you don’t need to include it when using Evora UI components.
