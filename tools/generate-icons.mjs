import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureDir, listSvgFilesRec, dirExists } from './lib/fs.mjs';
import { toPascalCase, toKebabCase, categoryKeyFromRel } from './lib/case.mjs';
import { extractInnerSvg, optimizeSvg } from './lib/svg.mjs';
import { buildVueComponent, buildTsRenderComponent, buildTsRenderComponentStatic } from './lib/builders.mjs';
import { writeVariantIndexes, writeTopIndex, writeDts, writeNames, writeCategories, writeAliases } from './lib/outputs.mjs';

// Resolve repo root relative to this script location
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const STRICT = process.env.STRICT === '1' || argv.includes('--strict');
const pkgArgIndex = argv.indexOf('--pkg');
const pkgPath = pkgArgIndex !== -1 ? argv[pkgArgIndex + 1] : 'packages/vue';
const isMainVuePkg = /packages\/vue(\/|$)/.test(pkgPath) && !/packages\/vue-next(\/|$)/.test(pkgPath);
let STATIC_VNODE = false;
if (argv.includes('--no-static-vnode') || process.env.STATIC_VNODE === '0') {
  STATIC_VNODE = false;
} else if (process.env.STATIC_VNODE === '1' || argv.includes('--static-vnode')) {
  STATIC_VNODE = true;
} else if (isMainVuePkg) {
  // Default to static VNode mode for the main vue package
  STATIC_VNODE = true;
}

const iconsDir = path.join(root, 'icons');
const outDir = path.join(root, pkgPath, 'src', 'icons');
const IS_RENDER_MODULES = /packages\/(vue-next|vue)\b/.test(pkgPath);

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

  const perVariant = {
    line: { exportsBase: [], exportsSuffix: [], asyncEntries: [] },
    filled: { exportsBase: [], exportsSuffix: [], asyncEntries: [] },
  };
  const categories = {};

  for (const { variant, dir } of sources) {
    const outVariantDir = path.join(outDir, variant);
    await ensureDir(outVariantDir);

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

      const data = optimizeSvg(raw);

      const inner = extractInnerSvg(data)
        .replaceAll('<svg', '<!-- svg root removed -->')
        .replaceAll('</svg>', '<!-- svg root removed -->')
        .split('\n')
        .map((l) => '    ' + l)
        .join('\n');

      const name = toPascalCase(file);
      const compFile = path.join(outVariantDir, `Ev${name}.${IS_RENDER_MODULES ? 'ts' : 'vue'}`);
      const component = IS_RENDER_MODULES
        ? (STATIC_VNODE ? buildTsRenderComponentStatic(name, inner) : buildTsRenderComponent(name, inner))
        : buildVueComponent(name, inner, variant);
      await writeFile(compFile, component, 'utf8');
      perVariant[variant].exportsBase.push(`export { default as Ev${name} } from './Ev${name}${IS_RENDER_MODULES ? '' : '.vue'}'`);
      const suffix = variant === 'filled' ? 'Filled' : 'Line';
      // Preferred alias style: Ev<Name><Suffix>, e.g., EvChatFilled / EvChatLine
      perVariant[variant].exportsSuffix.push(`export { default as Ev${name}${suffix} } from './${variant}/Ev${name}${IS_RENDER_MODULES ? '' : '.vue'}'`);
      const key = toKebabCase(file);
      perVariant[variant].asyncEntries.push(`  ${JSON.stringify(key)}: () => import('./Ev${name}${IS_RENDER_MODULES ? '' : '.vue'}')`);
      nameSet.add(key);
      keyToPascal.set(key, name);
      if (variant === 'line') lineSet.add(key); else if (variant === 'filled') filledSet.add(key);

      const categoryKey = categoryKeyFromRel(entry.rel);
      if (!categories[categoryKey]) categories[categoryKey] = {};
      if (!categories[categoryKey][key]) categories[categoryKey][key] = { line: false, filled: false };
      categories[categoryKey][key][variant] = true;
    }
  }

  for (const variant of ['line','filled']) {
    await writeVariantIndexes(outDir, variant, perVariant[variant].exportsBase, perVariant[variant].asyncEntries, root)
  }

  await writeTopIndex(outDir, nameSet, keyToPascal, perVariant, IS_RENDER_MODULES, root)
  await writeDts(outDir, nameSet, lineSet, filledSet, keyToPascal, root)
  await writeNames(outDir, nameSet, root)
  await writeCategories(root, categories)
  await writeAliases(outDir, nameSet, lineSet, filledSet, keyToPascal, IS_RENDER_MODULES, root)
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
