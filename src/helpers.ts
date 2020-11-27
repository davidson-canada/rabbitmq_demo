export function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && !!x;
}

export function isNotNil<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}
