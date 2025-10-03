import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDir, listSvgFilesRec, dirExists } from './lib/fs.mjs';
import { toPascalCase, toKebabCase, categoryKeyFromRel } from './lib/case.mjs';
import { extractInnerSvg, optimizeSvg, scopeSvgIds, forceRootStroke } from './lib/svg.mjs';
import { buildTsRenderComponent, buildTsRenderComponentStatic } from './lib/builders.mjs';
import { writeTopIndex, writeDts, writeNames, writeCategories } from './lib/outputs.mjs';

// Resolve repo root relative to this script location
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const STRICT = process.env.STRICT === '1' || argv.includes('--strict');
const pkgArgIndex = argv.indexOf('--pkg');
const pkgPath = pkgArgIndex !== -1 ? argv[pkgArgIndex + 1] : 'packages/vue';
// For this monorepo we only target the Vue package and always emit TS render modules.
// Default to static VNode mode (CSP/SSR‑friendly); can be overridden via flags.
let STATIC_VNODE = true;
if (argv.includes('--no-static-vnode') || process.env.STATIC_VNODE === '0') {
  STATIC_VNODE = false;
} else if (process.env.STATIC_VNODE === '1' || argv.includes('--static-vnode')) {
  STATIC_VNODE = true;
}
// Option: for line sets, strip per-node stroke to force root-level stroke control
const FORCE_ROOT_STROKE = argv.includes('--force-root-stroke') || process.env.FORCE_ROOT_STROKE === '1';

const iconsDir = path.join(root, 'icons');
const outDir = path.join(root, pkgPath, 'src', 'icons');

async function main() {
  await ensureDir(outDir);

  const sources = [];
  if (!(await dirExists(iconsDir))) {
    throw new Error(`[generate-icons] Missing required directory: ${path.relative(root, iconsDir)}`);
  }
  const lineRoot = path.join(iconsDir, 'line');
  const filledRoot = path.join(iconsDir, 'filled');
  if (await dirExists(lineRoot)) sources.push({ variant: 'line', dir: lineRoot });
  if (await dirExists(filledRoot)) sources.push({ variant: 'filled', dir: filledRoot });
  if (!sources.length) {
    throw new Error('[generate-icons] No sources found under icons/{line,filled}');
  }

  const nameSet = new Set();
  const lineSet = new Set();
  const filledSet = new Set();
  const keyToPascal = new Map();

  const categories = {};

  for (const { variant, dir } of sources) {
    await ensureDir(outDir);

    const entries = await listSvgFilesRec(dir);
    for (const entry of entries) {
      const file = path.basename(entry.abs);
      const raw = await readFile(entry.abs, 'utf8');

      const vbMatch = raw.match(/viewBox\s*=\s*\"([^\"]+)\"/i);
      if (!vbMatch || vbMatch[1].trim() !== '0 0 32 32') {
        const msg = `[generate-icons] ${file} must have viewBox=\"0 0 32 32\" (found: ${vbMatch ? vbMatch[1] : 'none'})`;
        if (STRICT) throw new Error(msg);
        else console.warn(`Warning: ${msg}`);
      }

      let data = optimizeSvg(raw);
      // Scope ids to the component to avoid SSR/dom collisions
      const idKey = toKebabCase(file);
      const idPrefix = `ev-${idKey}${variant === 'filled' ? '-filled' : ''}`;
      data = scopeSvgIds(data, idPrefix);
      // If requested and this is a line variant, normalize to root-driven stroke
      if (FORCE_ROOT_STROKE && variant === 'line') {
        data = forceRootStroke(data);
      }

      const inner = extractInnerSvg(data)
        .replaceAll('<svg', '<!-- svg root removed -->')
        .replaceAll('</svg>', '<!-- svg root removed -->')
        // Do not inject leading indentation — SSR hydration counts static nodes strictly.
        // Keep inner content formatting as-is to avoid leading/trailing text nodes.
        .trim();

      const name = toPascalCase(file);
      const compFile = path.join(outDir, `Ev${name}${variant === 'filled' ? 'Filled' : ''}.ts`);
      const runtimeName = name + (variant === 'filled' ? 'Filled' : '');
      const component = STATIC_VNODE ? buildTsRenderComponentStatic(runtimeName, inner) : buildTsRenderComponent(runtimeName, inner);
      await writeFile(compFile, component, 'utf8');
      const key = toKebabCase(file);
      nameSet.add(key);
      keyToPascal.set(key, name);
      if (variant === 'line') lineSet.add(key); else if (variant === 'filled') filledSet.add(key);

      const categoryKey = categoryKeyFromRel(entry.rel);
      if (!categories[categoryKey]) categories[categoryKey] = {};
      if (!categories[categoryKey][key]) categories[categoryKey][key] = { line: false, filled: false };
      categories[categoryKey][key][variant] = true;
    }
  }

  await writeTopIndex(outDir, nameSet, keyToPascal, lineSet, filledSet, root)
  await writeDts(outDir, nameSet, lineSet, filledSet, keyToPascal, root)
  await writeNames(outDir, nameSet, lineSet, filledSet, root)
  await writeCategories(root, categories)
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
