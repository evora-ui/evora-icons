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

