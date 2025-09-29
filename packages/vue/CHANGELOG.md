# @evora-ui/icons-vue

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
