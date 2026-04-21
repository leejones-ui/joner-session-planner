import { z } from "zod";

// Pitch coordinates are normalized. x goes 0 to 100 (west to east). y goes 0 to 60 (north to south).
// Renderers can draw at any size deterministically.

export const PitchPreset = z.enum(["full", "half", "quarter", "custom"]);

export const Pitch = z.object({
  preset: PitchPreset,
  width: z.number().default(100),
  height: z.number().default(60),
  orientation: z.enum(["landscape", "portrait"]).default("landscape"),
  markings: z.boolean().default(true),
  goals: z.array(z.enum(["north", "south", "east", "west"])).default(["north", "south"]),
});

export const Zone = z.object({
  id: z.string(),
  shape: z.enum(["rect", "circle"]),
  x: z.number(),
  y: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  radius: z.number().optional(),
  label: z.string().optional(),
  color: z.string().default("#ffffff"),
  style: z.enum(["solid", "dashed"]).default("solid"),
});

export const Cone = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  color: z.enum(["yellow", "red", "blue", "white", "orange", "green"]).default("yellow"),
  size: z.enum(["tall", "flat"]).default("tall"),
});

export const Player = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  team: z.enum(["red", "blue", "yellow", "neutral"]).default("red"),
  role: z.enum(["player", "server", "gk", "defender", "attacker", "coach"]).default("player"),
  label: z.string().optional(),
  hasBall: z.boolean().default(false),
});

export const Ball = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
});

export const Arrow = z.object({
  id: z.string(),
  from: z.object({ x: z.number(), y: z.number() }),
  to: z.object({ x: z.number(), y: z.number() }),
  type: z.enum(["pass", "run", "dribble", "shot"]).default("pass"),
  style: z.enum(["solid", "dashed", "wavy"]).default("solid"),
  curve: z.number().default(0),
  color: z.string().default("#ffff00"),
});

export const Mannequin = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  color: z.enum(["blue", "red", "yellow", "white", "black"]).default("blue"),
});

export const MiniGoal = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  facing: z.enum(["south", "north", "east", "west"]).default("south"),
});

export const Equipment = z.object({
  id: z.string(),
  type: z.enum(["ladder", "hurdle", "pole", "rebounder", "disc"]),
  x: z.number(),
  y: z.number(),
  rotation: z.number().default(0),
});

export const DiagramLabel = z.object({
  id: z.string(),
  x: z.number(),
  y: z.number(),
  text: z.string(),
  size: z.enum(["sm", "md", "lg"]).default("md"),
});

export const Diagram = z.object({
  pitch: Pitch,
  zones: z.array(Zone).default([]),
  cones: z.array(Cone).default([]),
  players: z.array(Player).default([]),
  balls: z.array(Ball).default([]),
  arrows: z.array(Arrow).default([]),
  mannequins: z.array(Mannequin).default([]),
  minigoals: z.array(MiniGoal).default([]),
  equipment: z.array(Equipment).default([]),
  labels: z.array(DiagramLabel).default([]),
});

export type Pitch = z.infer<typeof Pitch>;
export type Zone = z.infer<typeof Zone>;
export type Cone = z.infer<typeof Cone>;
export type Player = z.infer<typeof Player>;
export type Ball = z.infer<typeof Ball>;
export type Arrow = z.infer<typeof Arrow>;
export type Mannequin = z.infer<typeof Mannequin>;
export type MiniGoal = z.infer<typeof MiniGoal>;
export type Equipment = z.infer<typeof Equipment>;
export type DiagramLabel = z.infer<typeof DiagramLabel>;
export type Diagram = z.infer<typeof Diagram>;

export const EMPTY_DIAGRAM: Diagram = {
  pitch: {
    preset: "full",
    width: 100,
    height: 60,
    orientation: "landscape",
    markings: true,
    goals: ["north", "south"],
  },
  zones: [],
  cones: [],
  players: [],
  balls: [],
  arrows: [],
  mannequins: [],
  minigoals: [],
  equipment: [],
  labels: [],
};
