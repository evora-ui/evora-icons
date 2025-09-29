import { readdir, mkdir } from 'node:fs/promises'
import path from 'node:path'

export async function ensureDir(dir) {
  await mkdir(dir, { recursive: true })
}

export async function readDirSafe(dir) {
  try {
    return await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
}

export async function listSvgFilesRec(baseDir) {
  const results = []
  async function walk(current, rel = '') {
    const entries = await readDirSafe(current)
    for (const ent of entries) {
      if (ent.name.startsWith('.')) continue
      const abs = path.join(current, ent.name)
      const r = rel ? path.join(rel, ent.name) : ent.name
      if (ent.isDirectory()) {
        await walk(abs, r)
      } else if (ent.isFile() && ent.name.toLowerCase().endsWith('.svg')) {
        results.push({ abs, rel: r })
      }
    }
  }
  await walk(baseDir)
  return results
}

export async function dirExists(p) {
  try { await readdir(p); return true } catch { return false }
}

