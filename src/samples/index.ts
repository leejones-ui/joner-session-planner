import type { Diagram } from "@/lib/schema/diagram";

// Five hand-crafted reference diagrams. Used to validate the renderer and as visual smoke tests.

const basePitch = {
  preset: "full" as const,
  width: 100,
  height: 60,
  orientation: "landscape" as const,
  markings: true,
  goals: ["west", "east"] as ("north" | "south" | "east" | "west")[],
};

export const oneVOneToGoal: Diagram = {
  pitch: basePitch,
  zones: [],
  cones: [
    { id: "c1", x: 55, y: 20, color: "yellow", size: "tall" },
    { id: "c2", x: 75, y: 20, color: "yellow", size: "tall" },
    { id: "c3", x: 55, y: 40, color: "yellow", size: "tall" },
    { id: "c4", x: 75, y: 40, color: "yellow", size: "tall" },
  ],
  players: [
    { id: "gk", x: 96, y: 30, team: "yellow", role: "gk", label: "GK", hasBall: false },
    { id: "d1", x: 78, y: 30, team: "blue", role: "defender", label: "D", hasBall: false },
    { id: "a1", x: 58, y: 30, team: "red", role: "attacker", label: "A", hasBall: true },
    { id: "s1", x: 42, y: 30, team: "neutral", role: "server", label: "S", hasBall: false },
  ],
  balls: [],
  arrows: [
    { id: "ar1", from: { x: 44, y: 30 }, to: { x: 56, y: 30 }, type: "pass", style: "solid", curve: 0, color: "#ffff00" },
    { id: "ar2", from: { x: 60, y: 30 }, to: { x: 92, y: 30 }, type: "dribble", style: "wavy", curve: -5, color: "#fb923c" },
  ],
  mannequins: [],
  minigoals: [],
  equipment: [],
  labels: [{ id: "l1", x: 50, y: 55, text: "1v1 to goal, attack east", size: "md" }],
};

export const twoVTwoPassingBox: Diagram = {
  pitch: { ...basePitch, markings: true },
  zones: [
    { id: "z1", shape: "rect", x: 35, y: 15, width: 30, height: 30, label: "30x30 box", color: "#ffffff", style: "dashed" },
  ],
  cones: [
    { id: "c1", x: 35, y: 15, color: "red", size: "tall" },
    { id: "c2", x: 65, y: 15, color: "red", size: "tall" },
    { id: "c3", x: 35, y: 45, color: "red", size: "tall" },
    { id: "c4", x: 65, y: 45, color: "red", size: "tall" },
  ],
  players: [
    { id: "r1", x: 43, y: 23, team: "red", role: "player", label: "1", hasBall: true },
    { id: "r2", x: 57, y: 37, team: "red", role: "player", label: "2", hasBall: false },
    { id: "b1", x: 50, y: 22, team: "blue", role: "defender", label: "1", hasBall: false },
    { id: "b2", x: 50, y: 38, team: "blue", role: "defender", label: "2", hasBall: false },
  ],
  balls: [],
  arrows: [
    { id: "a1", from: { x: 45, y: 24 }, to: { x: 55, y: 36 }, type: "pass", style: "solid", curve: 2, color: "#ffff00" },
    { id: "a2", from: { x: 57, y: 35 }, to: { x: 45, y: 25 }, type: "run", style: "solid", curve: -3, color: "#22d3ee" },
  ],
  mannequins: [],
  minigoals: [],
  equipment: [],
  labels: [{ id: "l1", x: 50, y: 52, text: "Keep the ball, 2v2", size: "md" }],
};

export const finishingWithRebounder: Diagram = {
  pitch: basePitch,
  zones: [],
  cones: [
    { id: "c1", x: 70, y: 20, color: "yellow", size: "flat" },
    { id: "c2", x: 70, y: 40, color: "yellow", size: "flat" },
  ],
  players: [
    { id: "gk", x: 97, y: 30, team: "yellow", role: "gk", label: "GK", hasBall: false },
    { id: "a1", x: 70, y: 20, team: "red", role: "attacker", label: "A1", hasBall: true },
    { id: "a2", x: 70, y: 40, team: "red", role: "attacker", label: "A2", hasBall: false },
    { id: "s1", x: 60, y: 10, team: "neutral", role: "server", label: "S", hasBall: false },
  ],
  balls: [
    { id: "b1", x: 62, y: 10 },
    { id: "b2", x: 64, y: 10 },
  ],
  arrows: [
    { id: "a1", from: { x: 62, y: 12 }, to: { x: 70, y: 19 }, type: "pass", style: "solid", curve: 2, color: "#ffff00" },
    { id: "a2", from: { x: 71, y: 21 }, to: { x: 85, y: 24 }, type: "pass", style: "solid", curve: -2, color: "#ffff00" },
    { id: "a3", from: { x: 85, y: 25 }, to: { x: 95, y: 30 }, type: "shot", style: "solid", curve: 0, color: "#f87171" },
    { id: "a4", from: { x: 70, y: 40 }, to: { x: 88, y: 34 }, type: "run", style: "dashed", curve: -3, color: "#22d3ee" },
  ],
  mannequins: [
    { id: "m1", x: 80, y: 25, color: "blue" },
  ],
  minigoals: [],
  equipment: [
    { id: "e1", type: "rebounder", x: 86, y: 22, rotation: -20 },
  ],
  labels: [{ id: "l1", x: 50, y: 55, text: "Finishing, use the rebounder for the cutback", size: "md" }],
};

export const warmupFootworkPoles: Diagram = {
  pitch: { ...basePitch, preset: "half", markings: false },
  zones: [],
  cones: [
    { id: "c1", x: 10, y: 30, color: "orange", size: "flat" },
    { id: "c2", x: 90, y: 30, color: "orange", size: "flat" },
  ],
  players: [
    { id: "p1", x: 8, y: 30, team: "red", role: "player", label: "1", hasBall: false },
    { id: "p2", x: 6, y: 30, team: "red", role: "player", label: "2", hasBall: false },
    { id: "p3", x: 4, y: 30, team: "red", role: "player", label: "3", hasBall: false },
  ],
  balls: [],
  arrows: [
    { id: "ar1", from: { x: 12, y: 30 }, to: { x: 30, y: 30 }, type: "run", style: "dashed", curve: 0, color: "#22d3ee" },
    { id: "ar2", from: { x: 48, y: 30 }, to: { x: 70, y: 30 }, type: "run", style: "dashed", curve: 0, color: "#22d3ee" },
    { id: "ar3", from: { x: 76, y: 30 }, to: { x: 88, y: 30 }, type: "run", style: "dashed", curve: 0, color: "#22d3ee" },
  ],
  mannequins: [],
  minigoals: [],
  equipment: [
    { id: "lad", type: "ladder", x: 22, y: 30, rotation: 0 },
    { id: "h1", type: "hurdle", x: 40, y: 30, rotation: 0 },
    { id: "h2", type: "hurdle", x: 44, y: 30, rotation: 0 },
    { id: "p1", type: "pole", x: 55, y: 30, rotation: 0 },
    { id: "p2", type: "pole", x: 60, y: 30, rotation: 0 },
    { id: "p3", type: "pole", x: 65, y: 30, rotation: 0 },
    { id: "h3", type: "hurdle", x: 74, y: 30, rotation: 0 },
  ],
  labels: [
    { id: "l1", x: 50, y: 10, text: "Ladder, hurdles, poles, finish through cone", size: "md" },
    { id: "l2", x: 50, y: 52, text: "Quick feet warm-up", size: "sm" },
  ],
};

export const fourVFourMiniGoals: Diagram = {
  pitch: { ...basePitch, markings: false },
  zones: [
    { id: "z1", shape: "rect", x: 20, y: 10, width: 60, height: 40, label: "", color: "#ffffff", style: "solid" },
  ],
  cones: [
    { id: "c1", x: 20, y: 10, color: "red", size: "tall" },
    { id: "c2", x: 80, y: 10, color: "red", size: "tall" },
    { id: "c3", x: 20, y: 50, color: "red", size: "tall" },
    { id: "c4", x: 80, y: 50, color: "red", size: "tall" },
  ],
  players: [
    { id: "r1", x: 32, y: 22, team: "red", role: "player", label: "1", hasBall: false },
    { id: "r2", x: 35, y: 38, team: "red", role: "player", label: "2", hasBall: true },
    { id: "r3", x: 45, y: 15, team: "red", role: "player", label: "3", hasBall: false },
    { id: "r4", x: 50, y: 32, team: "red", role: "player", label: "4", hasBall: false },
    { id: "b1", x: 55, y: 20, team: "blue", role: "player", label: "1", hasBall: false },
    { id: "b2", x: 60, y: 35, team: "blue", role: "player", label: "2", hasBall: false },
    { id: "b3", x: 68, y: 45, team: "blue", role: "player", label: "3", hasBall: false },
    { id: "b4", x: 72, y: 25, team: "blue", role: "player", label: "4", hasBall: false },
  ],
  balls: [],
  arrows: [
    { id: "ar1", from: { x: 37, y: 37 }, to: { x: 48, y: 32 }, type: "pass", style: "solid", curve: 0, color: "#ffff00" },
  ],
  mannequins: [],
  minigoals: [
    { id: "g1", x: 22, y: 30, facing: "east" },
    { id: "g2", x: 78, y: 30, facing: "west" },
  ],
  equipment: [],
  labels: [{ id: "l1", x: 50, y: 55, text: "4v4 to mini-goals", size: "md" }],
};

export const SAMPLES: { id: string; title: string; diagram: Diagram }[] = [
  { id: "1v1", title: "1v1 to goal with server", diagram: oneVOneToGoal },
  { id: "2v2", title: "2v2 passing box", diagram: twoVTwoPassingBox },
  { id: "finishing", title: "Finishing with rebounder", diagram: finishingWithRebounder },
  { id: "warmup", title: "Warm-up footwork with poles", diagram: warmupFootworkPoles },
  { id: "4v4", title: "4v4 with mini-goals", diagram: fourVFourMiniGoals },
];
