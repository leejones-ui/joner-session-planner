// Belt-and-braces: even with the prompt rule, swap any em/en dashes that slip through.
// Em dash (U+2014) becomes a comma. En dash (U+2013) becomes a hyphen (preserves ranges like "10-15 minutes").

const EM = /—\s?/g;
const EN = /–/g;

export function stripDashes<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(EM, ", ").replace(EN, "-") as T;
  }
  if (Array.isArray(value)) {
    return value.map((v) => stripDashes(v)) as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = stripDashes(v);
    }
    return out as T;
  }
  return value;
}
