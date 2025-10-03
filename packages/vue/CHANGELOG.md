# @evora-ui/icons-vue

## 1.0.0

### Breaking (version bump rationale)
- Major version to formalize the new flat import experience and simplify internal generation. Existing explicit variant paths remain available for back‑compat.

### Features
- Flat imports: import both default and variant components from a single entry.
  - Example: `import { EvUser, EvUserFilled } from '@evora-ui/icons-vue/icons'`.
- Export `normalizeIconKey(key: string)` for consistent name normalization.
- Global component type augmentation for `<EvIcon>` so IDEs (Volar) autocomplete the tag and the `name` prop values.
- Generator flag `--force-root-stroke` (`FORCE_ROOT_STROKE=1`) to strip per-node stroke attributes in line sets for root‑driven theming.

### Fixed
- SSR hydration mismatch: static VNode HTML no longer contains leading/trailing text nodes; icons no longer disappear after hydration.

### Changed
- `EVORA_ICONS_KEY` is now a typed `InjectionKey<IconsProvideMap>` (Symbol) for safe provide/inject.
  - Migration note: use the exported `EVORA_ICONS_KEY` constant rather than a raw string.

### Tooling / Internals
- Simplify icon generator: always emit TS render modules for Vue; default to static VNodes.
- Remove per‑icon alias files and per‑variant indices; generate Ev<Name>/Ev<Name>Filled files in a single folder.
- Combined index re‑exports directly from those files; categories JSON generation unchanged.

### Docs / CI
- Reworked README with Quick Start, SSR/Nuxt example, IDE hints.
- Added CI workflow for ESLint.

## 0.2.0

### Features
- Add async loader exports:
  - `@evora-ui/icons-vue/icons/line/async`
  - `@evora-ui/icons-vue/icons/filled/async`

### Docs
- Improve README: highlight 1500+ free icons, two variants, usage tips.

### Chore / Meta
- Polish package metadata (description, keywords, author, repository.directory, homepage).
- Keep only `src/icons/names.ts` tracked in git; ignore other generated icon sources.

### Tooling (monorepo)
- Refactor icon generator into modules; simplify main script.
- Move categories output to repo root (`/categories`) with normalized keys (`&` → `-`).
- Category entries explicitly include both flags: `{ line: true|false, filled: true|false }`.

Note: No runtime breaking changes expected for package consumers. Categories JSON is not shipped with the package (available in the monorepo under `/categories`).
