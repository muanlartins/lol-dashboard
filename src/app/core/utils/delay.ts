export function delay(ms: number) {
  return new Promise((_) => setTimeout(_, ms));
}
