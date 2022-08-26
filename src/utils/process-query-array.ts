export function processQueryArray(arr?: string | string[]): string[] {
  if (!arr) {
    return undefined;
  }
  return Array.isArray(arr) ? arr : arr.split(',');
}
