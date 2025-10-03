import { optimize } from 'svgo'

export function extractInnerSvg(content) {
  const match = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)
  return match ? match[1].trim() : content
}

export function optimizeSvg(raw) {
  let { data } = optimize(raw, {
    multipass: true,
    plugins: [
      { name: 'removeDimensions', active: true },
      { name: 'removeXMLNS', active: true },
    ],
  })
  // Remove all explicit fill attributes so color is controlled via root :fill
  data = data.replace(/\sfill=\"[^\"]*\"/gi, "")
  return data
}

// Prefix and scope all ids and their references within an SVG string.
// Ensures SSR/DOM safety when multiple instances are mounted.
export function scopeSvgIds(svg, prefix) {
  if (!svg || !prefix) return svg
  const idRe = /\bid=\"([^\"]+)\"/g
  const ids = new Set()
  let m
  while ((m = idRe.exec(svg))) ids.add(m[1])
  if (!ids.size) return svg
  const map = new Map()
  for (const id of ids) {
    const safe = String(id).replace(/[^a-zA-Z0-9_:\-.]/g, '-')
    map.set(id, `${prefix}-${safe}`)
  }
  for (const [from, to] of map) {
    const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    svg = svg.replace(new RegExp(`(id=\\\")${esc}(\\\")`, 'g'), `$1${to}$2`)
    svg = svg.replace(new RegExp(`url\\(#${esc}\\)`, 'g'), `url(#${to})`)
    svg = svg.replace(new RegExp(`(href=\\\"#)${esc}(\\\")`, 'g'), `$1${to}$2`)
    svg = svg.replace(new RegExp(`(xlink:href=\\\"#)${esc}(\\\")`, 'g'), `$1${to}$2`)
    svg = svg.replace(new RegExp(`(clip-path=\\\"#)${esc}(\\\")`, 'g'), `$1${to}$2`)
  }
  return svg
}

// Remove stroke-related attributes from child elements so stroke can be
// controlled from the root <svg>. Intended for line icons when the
// --force-root-stroke flag is used by the generator.
export function forceRootStroke(svg) {
  if (!svg) return svg
  // Strip common stroke attributes applied on individual nodes
  const patterns = [
    /\sstroke=\"[^\"]*\"/gi,
    /\sstroke-width=\"[^\"]*\"/gi,
    /\sstroke-linecap=\"[^\"]*\"/gi,
    /\sstroke-linejoin=\"[^\"]*\"/gi,
    /\sstroke-miterlimit=\"[^\"]*\"/gi,
    /\sstroke-opacity=\"[^\"]*\"/gi,
  ]
  for (const re of patterns) svg = svg.replace(re, '')
  // Best-effort removal of inline style stroke declarations (non-destructive)
  // This only removes `stroke:*` chunks from style="..." while preserving others.
  svg = svg.replace(/style=\"([^\"]*)\"/gi, (_m, style) => {
    const parts = String(style)
      .split(/\s*;\s*/)
      .filter(Boolean)
      .filter((decl) => !/^stroke(-width|-linecap|-linejoin|-miterlimit|-opacity)?:/i.test(decl))
    return parts.length ? `style=\"${parts.join('; ')}\"` : ''
  })
  return svg
}
