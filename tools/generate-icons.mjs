import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

// Resolve repo root relative to this script location to be robust when run from workspaces
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

const svgsDir = path.join(root, 'svgs');
const outDir = path.join(root, pkgPath, 'src', 'icons');
const IS_RENDER_MODULES = /packages\/(vue-next|vue)\b/.test(pkgPath);

function toPascalCase(name) {
  return name
    .replace(/\.svg$/i, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function toKebabCase(name) {
  const base = name.replace(/\.svg$/i, '')
  // Replace underscores/spaces with hyphen
  .replace(/[ _]+/g, '-')
  // Insert hyphen between lowercase-to-uppercase boundaries, e.g., AddressBook -> Address-Book
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  // Insert hyphen between letter-number and number-letter boundaries
  .replace(/([A-Za-z])(\d)/g, '$1-$2')
  .replace(/(\d)([A-Za-z])/g, '$1-$2')
  // Collapse multiple hyphens
  .replace(/-+/g, '-')
  .toLowerCase();
  return base;
}

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

function extractInnerSvg(content) {
  const match = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return match ? match[1].trim() : content;
}

function buildVueComponent(name, inner, variant) {
  return `\
<template>\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    :width=\"resolvedSize\"\n    :height=\"resolvedSize\"\n    viewBox=\"0 0 32 32\"\n    :fill=\"fill\"\n    :stroke=\"stroke\"\n    :stroke-width=\"strokeWidth\"\n    :stroke-linecap=\"linecap\"\n    :stroke-linejoin=\"linejoin\"\n    :aria-label=\"ariaLabel\"\n    :aria-hidden=\"ariaLabel ? 'false' : 'true'\"\n    role=\"img\"\n  >\n${inner}\n  </svg>\n</template>\n\n<script setup lang=\"ts\">\nimport { computed } from 'vue'\n\n type SizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'\n const sizeMap: Record<SizeToken, number> = { xs: 12, sm: 16, md: 24, lg: 32, xl: 40, '2xl': 48, '3xl': 56 }\n\n const props = withDefaults(defineProps<{\n   size?: number | string | SizeToken\n   stroke?: string\n   fill?: string\n   strokeWidth?: number | string\n   linecap?: 'round' | 'square' | 'butt'\n   linejoin?: 'round' | 'bevel' | 'miter'\n   ariaLabel?: string\n }>(), { size: 32, stroke: 'none', fill: 'currentColor', strokeWidth: 1, linecap: 'round', linejoin: 'round' })\n\n const resolvedSize = computed(() => {\n   const s = props.size as any\n   return typeof s === 'string' && (s in sizeMap) ? sizeMap[s as SizeToken] : s\n })\n</script>\n`;
}

function buildTsRenderComponent(name, inner) {
  const innerJSON = JSON.stringify(inner);
  return `import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'Ev${name}',
  props: {
    size: { type: [Number, String], default: 32 },
    stroke: { type: String, default: 'none' },
    fill: { type: String, default: 'currentColor' },
    strokeWidth: { type: [Number, String], default: 1 },
    linecap: { type: String, default: 'round' },
    linejoin: { type: String, default: 'round' },
    ariaLabel: { type: String, default: undefined },
  },
  setup(props) {
    return () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      width: (({xs:12,sm:16,md:24,lg:32,xl:40,'2xl':48,'3xl':56} as any)[props.size as any] ?? props.size) as any,
      height: (({xs:12,sm:16,md:24,lg:32,xl:40,'2xl':48,'3xl':56} as any)[props.size as any] ?? props.size) as any,
      viewBox: '0 0 32 32',
      fill: props.fill,
      stroke: props.stroke,
      'stroke-width': props.strokeWidth as any,
      'stroke-linecap': props.linecap as any,
      'stroke-linejoin': props.linejoin as any,
      'aria-label': props.ariaLabel,
      'aria-hidden': props.ariaLabel ? 'false' : 'true',
      role: 'img',
      innerHTML: ${innerJSON},
    })
  }
})
`;
}

async function dirExists(p) {
  try { await readdir(p); return true } catch { return false }
}

function buildTsRenderComponentStatic(name, inner) {
  const innerJSON = JSON.stringify(inner);
  return `import { defineComponent, h, createStaticVNode } from 'vue'\nexport default defineComponent({\n  name: 'Ev${name}',\n  props: {\n    size: { type: [Number, String], default: 32 },\n    stroke: { type: String, default: 'none' },\n    fill: { type: String, default: 'currentColor' },\n    strokeWidth: { type: [Number, String], default: 1 },\n    linecap: { type: String, default: 'round' },\n    linejoin: { type: String, default: 'round' },\n    ariaLabel: { type: String, default: undefined },\n  },\n  setup(props) {\n    const sizeMap = { xs: 12, sm: 16, md: 24, lg: 32, xl: 40, '2xl': 48, '3xl': 56 } as const\n    const toPx = (s:any) => ((sizeMap as any)[s] ?? s)\n    return () => h('svg', {\n      xmlns: 'http://www.w3.org/2000/svg',\n      width: toPx(props.size) as any,\n      height: toPx(props.size) as any,\n      viewBox: '0 0 32 32',\n      fill: props.fill,\n      stroke: props.stroke,\n      'stroke-width': props.strokeWidth as any,\n      'stroke-linecap': props.linecap as any,\n      'stroke-linejoin': props.linejoin as any,\n      'aria-label': props.ariaLabel,\n      'aria-hidden': props.ariaLabel ? 'false' : 'true',\n      role: 'img',\n    }, [createStaticVNode(${innerJSON}, 1)])\n  }\n})\n`;
}

async function main() {
  await ensureDir(outDir);

  const hasLine = await dirExists(path.join(svgsDir, 'line'));
  const hasFilled = await dirExists(path.join(svgsDir, 'filled'));
  let hasRootLine = false;
  if (!hasLine) {
    try {
      const rootFiles = await readdir(svgsDir);
      hasRootLine = rootFiles.some((f) => f.endsWith('.svg'));
    } catch {}
  }

  const sources = [];
  if (hasLine) sources.push({ variant: 'line', dir: path.join(svgsDir, 'line') });
  if (hasFilled) sources.push({ variant: 'filled', dir: path.join(svgsDir, 'filled') });
  if (!hasLine && hasRootLine) sources.push({ variant: 'line', dir: svgsDir });
  if (!sources.length) sources.push({ variant: 'line', dir: svgsDir });

  const nameSet = new Set();
  const lineSet = new Set();
  const filledSet = new Set();
  const keyToPascal = new Map();

  const perVariant = {
    line: { exportsBase: [], exportsSuffix: [], asyncEntries: [] },
    filled: { exportsBase: [], exportsSuffix: [], asyncEntries: [] },
  };

  for (const { variant, dir } of sources) {
    const outVariantDir = path.join(outDir, variant);
    await ensureDir(outVariantDir);
    const files = await readdir(dir);

    for (const file of files) {
      if (!file.endsWith('.svg')) continue;
      const raw = await readFile(path.join(dir, file), 'utf8');

      const vbMatch = raw.match(/viewBox\s*=\s*\"([^\"]+)\"/i);
      if (!vbMatch || vbMatch[1].trim() !== '0 0 32 32') {
        const msg = `[generate-icons] ${file} must have viewBox=\"0 0 32 32\" (found: ${vbMatch ? vbMatch[1] : 'none'})`;
        if (STRICT) throw new Error(msg);
        else console.warn(`Warning: ${msg}`);
      }

      let { data } = optimize(raw, {
        multipass: true,
        plugins: [
          { name: 'removeDimensions', active: true },
          { name: 'removeXMLNS', active: true },
        ],
      });
      // Remove all explicit fill attributes so color is controlled via root :fill
      data = data.replace(/\sfill=\"[^\"]*\"/gi, "");

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
    }
  }

  for (const variant of ['line','filled']) {
    const lines = perVariant[variant].exportsBase;
    const idxPath = path.join(outDir, variant, 'index.ts');
    await ensureDir(path.dirname(idxPath));
    await writeFile(idxPath, lines.join('\n') + '\n', 'utf8');
    console.log(`Updated ${path.relative(root, idxPath)}`);

    const asyncTs = path.join(outDir, variant, 'async.ts');
    const asyncLines = [];
    asyncLines.push("export const ICON_LOADERS: Record<string, () => Promise<any>> = {");
    if (perVariant[variant].asyncEntries.length) asyncLines.push(perVariant[variant].asyncEntries.join(',\n'));
    asyncLines.push("}");
    await writeFile(asyncTs, asyncLines.join('\n') + '\n', 'utf8');
    console.log(`Updated ${path.relative(root, asyncTs)}`);
  }

  const iconsIndex = path.join(outDir, 'index.ts');
  const topLines = [];
  const reserved = new Set();
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key);
    const comp = `Ev${Name}`;
    reserved.add(comp);
    // Default top-level export points to root alias module (proxy to variant)
    topLines.push(`export { default as ${comp} } from './Ev${Name}${IS_RENDER_MODULES ? '' : '.vue'}'`);
  }
  // Add variant alias exports back at top-level for better DX/auto-imports,
  // but avoid name collisions with existing components (facades or icon names).
  for (const line of perVariant.line.exportsSuffix) {
    const m = line.match(/as\s+(Ev[\w]+)\s+\}/);
    const alias = m?.[1];
    if (alias && reserved.has(alias)) continue; // skip conflicting alias
    topLines.push(line);
  }
  for (const line of perVariant.filled.exportsSuffix) {
    const m = line.match(/as\s+(Ev[\w]+)\s+\}/);
    const alias = m?.[1];
    if (alias && reserved.has(alias)) continue; // skip conflicting alias
    topLines.push(line);
  }
  if (!topLines.length) topLines.push('// no icons generated');
  await writeFile(iconsIndex, topLines.join('\n') + '\n', 'utf8');
  console.log(`Updated ${path.relative(root, iconsIndex)}`);

  // Write .d.ts barrel explicitly for better IDE completions in consumers
  // We only generate for icons under src/icons (not for root src files).
  const dtsIndex = path.join(outDir, 'index.d.ts');
  const dtsLines = ["import type { DefineComponent } from 'vue'"]; // minimal type
  const dtsExported = new Set();
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key);
    const id = `Ev${Name}`;
    if (!dtsExported.has(id)) {
      dtsLines.push(`export const ${id}: DefineComponent<any, any, any>`);
      dtsExported.add(id);
    }
  }
  // Alias names
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key);
    if (lineSet.has(key)) {
      const id = `Ev${Name}Line`;
      if (!dtsExported.has(id)) {
        dtsLines.push(`export const ${id}: DefineComponent<any, any, any>`);
        dtsExported.add(id);
      }
    }
    if (filledSet.has(key)) {
      const id = `Ev${Name}Filled`;
      if (!dtsExported.has(id)) {
        dtsLines.push(`export const ${id}: DefineComponent<any, any, any>`);
        dtsExported.add(id);
      }
    }
  }
  await writeFile(dtsIndex, dtsLines.join('\n') + '\n', 'utf8');
  console.log(`Updated ${path.relative(root, dtsIndex)}`);

  const namesTs = path.join(outDir, 'names.ts');
  const nameLiterals = Array.from(nameSet).sort().map((k) => JSON.stringify(k));
  const namesFile = `export const ICON_NAMES = [${nameLiterals.join(', ')}] as const\nexport type IconName = typeof ICON_NAMES[number]\n`;
  await writeFile(namesTs, namesFile, 'utf8');
  console.log(`Updated ${path.relative(root, namesTs)}`);

  // Generate root alias modules that proxy to the preferred variant (line if present, else filled)
  for (const key of nameSet) {
    const Name = keyToPascal.get(key);
    const hasLine = lineSet.has(key);
    const hasFilled = filledSet.has(key);
    const target = hasLine ? `./line/Ev${Name}${IS_RENDER_MODULES ? '' : '.vue'}` : hasFilled ? `./filled/Ev${Name}${IS_RENDER_MODULES ? '' : '.vue'}` : null;
    if (!target) continue;
    const aliasPath = path.join(outDir, `Ev${Name}.${IS_RENDER_MODULES ? 'ts' : 'vue'}`);
    const content = IS_RENDER_MODULES
      ? `export { default } from '${target}'\n`
      : `<template>\n  <Comp v-bind=\"$attrs\" />\n</template>\n\n<script setup lang=\"ts\">\nimport Comp from '${target.replace(/'/g, "\\'")}'\n</script>\n`;
    await writeFile(aliasPath, content, 'utf8');
    console.log(`Updated ${path.relative(root, aliasPath)}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
