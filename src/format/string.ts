export function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-')
}

export function truncate(s: string, maxLength: number, suffix: string = '...'): string {
  if (s.length <= maxLength) return s
  return s.slice(0, maxLength - suffix.length) + suffix
}

export function camelToKebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

export function kebabToCamel(s: string): string {
  return s.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase())
}

export function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '')
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}
