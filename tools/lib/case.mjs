export function toPascalCase(name) {
  return name
    .replace(/\.svg$/i, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

export function toKebabCase(name) {
  const base = name.replace(/\.svg$/i, '')
    .replace(/[ _]+/g, '-')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .replace(/(\d)([A-Za-z])/g, '$1-$2')
    .replace(/-+/g, '-')
    .toLowerCase();
  return base;
}

export function categoryKeyFromRel(rel) {
  const relPath = rel.replace(/\\/g, '/');
  const parts = relPath.split('/');
  parts.pop();
  if (!parts.length) return 'uncategorized';
  return parts.map((seg) => toKebabCase(seg.replaceAll('&', '-'))).join('-');
}
