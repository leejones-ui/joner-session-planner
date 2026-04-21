import { z } from "zod";
import { Diagram } from "./diagram";

export const BlockType = z.enum(["warmup", "main", "game"]);

export const Block = z.object({
  id: z.string(),
  name: z.string(),
  type: BlockType,
  description: z.string(),
  durationMins: z.number().int().positive(),
  coachingPoints: z.array(z.string()).default([]),
  equipment: z.array(z.string()).default([]),
  diagram: Diagram,
});

export const Session = z.object({
  id: z.string(),
  title: z.string(),
  prompt: z.string(),
  objective: z.string(),
  blocks: z.array(Block),
  totalDuration: z.number().int().positive(),
  createdAt: z.string(),
});

// Schema variant used for the LLM structured output.
// No diagram on blocks yet (diagrams are filled in by a second fan-out call).
// No id/createdAt (server assigns).
export const SessionDraftBlock = Block.omit({ id: true, diagram: true });
export const SessionDraft = z.object({
  title: z.string(),
  objective: z.string(),
  blocks: z.array(SessionDraftBlock).min(1),
  totalDuration: z.number().int().positive(),
});

export type BlockType = z.infer<typeof BlockType>;
export type Block = z.infer<typeof Block>;
export type Session = z.infer<typeof Session>;
export type SessionDraftBlock = z.infer<typeof SessionDraftBlock>;
export type SessionDraft = z.infer<typeof SessionDraft>;

export const GenerateSessionInput = z.object({
  prompt: z.string().min(3).max(2000),
  ageGroup: z.string().max(20).optional(),
  playerCount: z.number().int().positive().max(40).optional(),
  duration: z.number().int().positive().max(180).optional(),
  focus: z.string().max(100).optional(),
});
export type GenerateSessionInput = z.infer<typeof GenerateSessionInput>;

export const GenerateDiagramInput = z.object({
  blockDescription: z.string().min(3),
  blockType: BlockType.optional(),
  playerCount: z.number().int().positive().optional(),
});
export type GenerateDiagramInput = z.infer<typeof GenerateDiagramInput>;

export const AssistantEditInput = z.object({
  block: Block,
  message: z.string().min(1),
});
export type AssistantEditInput = z.infer<typeof AssistantEditInput>;
