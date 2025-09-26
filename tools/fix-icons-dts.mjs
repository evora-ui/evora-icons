import { copyFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const argv = process.argv.slice(2)
const pkgArgIndex = argv.indexOf('--pkg')
const pkgPath = pkgArgIndex !== -1 ? argv[pkgArgIndex + 1] : 'packages/vue'

async function main() {
  const src = path.join(root, pkgPath, 'src', 'icons', 'index.d.ts')
  const dst = path.join(root, pkgPath, 'dist', 'icons', 'index.d.ts')
  try {
    await stat(src)
    await copyFile(src, dst)
    console.log(`[fix-icons-dts] (${pkgPath}) Overwrote dist/icons/index.d.ts from src/icons/index.d.ts`)
  } catch (e) {
    console.warn(`[fix-icons-dts] (${pkgPath}) Skip: ${e?.message || e}`)
  }
}

main()

