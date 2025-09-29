import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { ensureDir } from './fs.mjs'

export async function writeVariantIndexes(outDir, variant, exportsBase, asyncEntries, root) {
  const idxPath = path.join(outDir, variant, 'index.ts')
  await ensureDir(path.dirname(idxPath))
  await writeFile(idxPath, exportsBase.join('\n') + '\n', 'utf8')
  console.log(`Updated ${path.relative(root, idxPath)}`)

  const asyncTs = path.join(outDir, variant, 'async.ts')
  const asyncLines = []
  asyncLines.push("export const ICON_LOADERS: Record<string, () => Promise<any>> = {")
  if (asyncEntries.length) asyncLines.push(asyncEntries.join(',\n'))
  asyncLines.push("}")
  await writeFile(asyncTs, asyncLines.join('\n') + '\n', 'utf8')
  console.log(`Updated ${path.relative(root, asyncTs)}`)
}

export async function writeTopIndex(outDir, nameSet, keyToPascal, perVariant, isRenderModules, root) {
  const iconsIndex = path.join(outDir, 'index.ts')
  const topLines = []
  const reserved = new Set()
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key)
    const comp = `Ev${Name}`
    reserved.add(comp)
    topLines.push(`export { default as ${comp} } from './Ev${Name}${isRenderModules ? '' : '.vue'}'`)
  }
  for (const line of perVariant.line.exportsSuffix) {
    const m = line.match(/as\s+(Ev[\w]+)\s+\}/)
    const alias = m?.[1]
    if (alias && reserved.has(alias)) continue
    topLines.push(line)
  }
  for (const line of perVariant.filled.exportsSuffix) {
    const m = line.match(/as\s+(Ev[\w]+)\s+\}/)
    const alias = m?.[1]
    if (alias && reserved.has(alias)) continue
    topLines.push(line)
  }
  if (!topLines.length) topLines.push('// no icons generated')
  await writeFile(iconsIndex, topLines.join('\n') + '\n', 'utf8')
  console.log(`Updated ${path.relative(root, iconsIndex)}`)
}

export async function writeDts(outDir, nameSet, lineSet, filledSet, keyToPascal, root) {
  const dtsIndex = path.join(outDir, 'index.d.ts')
  const dtsLines = ["import type { DefineComponent } from 'vue'"]
  const dtsExported = new Set()
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key)
    const id = `Ev${Name}`
    if (!dtsExported.has(id)) {
      dtsLines.push(`export const ${id}: DefineComponent<any, any, any>`)
      dtsExported.add(id)
    }
  }
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key)
    if (lineSet.has(key)) {
      const id = `Ev${Name}Line`
      if (!dtsExported.has(id)) {
        dtsLines.push(`export const ${id}: DefineComponent<any, any, any>`)
        dtsExported.add(id)
      }
    }
    if (filledSet.has(key)) {
      const id = `Ev${Name}Filled`
      if (!dtsExported.has(id)) {
        dtsLines.push(`export const ${id}: DefineComponent<any, any, any>`)
        dtsExported.add(id)
      }
    }
  }
  await writeFile(dtsIndex, dtsLines.join('\n') + '\n', 'utf8')
  console.log(`Updated ${path.relative(root, dtsIndex)}`)
}

export async function writeNames(outDir, nameSet, root) {
  const namesTs = path.join(outDir, 'names.ts')
  const nameLiterals = Array.from(nameSet).sort().map((k) => JSON.stringify(k))
  const namesFile = `export const ICON_NAMES = [${nameLiterals.join(', ')}] as const\nexport type IconName = typeof ICON_NAMES[number]\n`
  await writeFile(namesTs, namesFile, 'utf8')
  console.log(`Updated ${path.relative(root, namesTs)}`)
}

export async function writeCategories(root, categories) {
  const catsDir = path.join(root, 'categories')
  await ensureDir(catsDir)
  const catKeys = Object.keys(categories).sort()
  const indexEntries = []
  for (const key of catKeys) {
    const data = categories[key]
    const filePkg = path.join(catsDir, `${key}.json`)
    await writeFile(filePkg, JSON.stringify(data, null, 2) + '\n', 'utf8')
    indexEntries.push({ key, file: `./${key}.json`, count: Object.keys(data).length })
  }
  const catsIndex = path.join(catsDir, 'index.json')
  const indexContent = JSON.stringify({ categories: indexEntries }, null, 2) + '\n'
  await writeFile(catsIndex, indexContent, 'utf8')
  console.log(`Updated ${path.relative(root, catsIndex)}`)
}

export async function writeAliases(outDir, nameSet, lineSet, filledSet, keyToPascal, isRenderModules, root) {
  for (const key of nameSet) {
    const Name = keyToPascal.get(key)
    const hasLine = lineSet.has(key)
    const hasFilled = filledSet.has(key)
    const target = hasLine ? `./line/Ev${Name}${isRenderModules ? '' : '.vue'}` : hasFilled ? `./filled/Ev${Name}${isRenderModules ? '' : '.vue'}` : null
    if (!target) continue
    const aliasPath = path.join(outDir, `Ev${Name}.${isRenderModules ? 'ts' : 'vue'}`)
    const content = isRenderModules
      ? `export { default } from '${target}'\n`
      : `<template>\n  <Comp v-bind=\"$attrs\" />\n</template>\n\n<script setup lang=\"ts\">\nimport Comp from '${target.replace(/'/g, "\\'")}'\n</script>\n`
    await writeFile(aliasPath, content, 'utf8')
    console.log(`Updated ${path.relative(root, aliasPath)}`)
  }
}

