import { z } from "zod";

// Anthropic tools expect an input_schema that is a JSON Schema object.
// zod v4 exposes toJSONSchema natively, which is exactly what we need.
export function zodToToolSchema(schema: z.ZodTypeAny) {
  const json = z.toJSONSchema(schema) as Record<string, unknown>;
  // Anthropic requires type: "object" at the top.
  if (json.type !== "object") {
    throw new Error("Tool input schema must be an object at the top level");
  }
  // Drop the $schema URI, Anthropic does not use it.
  delete json["$schema"];
  return json as { type: "object"; properties: Record<string, unknown>; required?: string[] };
}
