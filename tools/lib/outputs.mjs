import path from 'node:path'
import { writeFile, readFile } from 'node:fs/promises'
import { ensureDir } from './fs.mjs'

// Generate a flat combined index that exports:
// - Ev<Name> from the default variant (line if exists, otherwise filled)
// - Ev<Name>Line and Ev<Name>Filled explicit variant aliases
export async function writeTopIndex(outDir, nameSet, keyToPascal, lineSet, filledSet, root) {
  const iconsIndex = path.join(outDir, 'index.ts')
  const topLines = []
  const reserved = new Set()
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key)
    const comp = `Ev${Name}`
    reserved.add(comp)
    const target = lineSet.has(key) ? `./Ev${Name}` : `./Ev${Name}Filled`
    topLines.push(`export { default as ${comp} } from '${target}'`)
  }
  // explicit variant aliases
  for (const key of Array.from(nameSet).sort()) {
    const Name = keyToPascal.get(key)
    const aliasFilled = `Ev${Name}Filled`
    if (filledSet.has(key) && !reserved.has(aliasFilled)) topLines.push(`export { default as ${aliasFilled} } from './Ev${Name}Filled'`)
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

export async function writeNames(outDir, nameSet, lineSet, filledSet, root) {
  const namesTs = path.join(outDir, '../icons', 'names.ts')
  const all = []
  for (const key of Array.from(nameSet).sort()) {
    if (lineSet.has(key)) all.push(key)
    if (filledSet.has(key)) all.push(`${key}-filled`)
  }
  const nameLiterals = all.map((k) => JSON.stringify(k))
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
