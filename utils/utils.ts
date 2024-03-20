export function deepClone(data: any) {
  return JSON.parse(JSON.stringify(data));
}