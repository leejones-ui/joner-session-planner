import type {
  Arrow,
  Ball,
  Cone,
  Diagram,
  DiagramLabel,
  Equipment,
  Mannequin,
  MiniGoal,
  Player,
  Zone,
} from "@/lib/schema/diagram";

type Props = {
  diagram: Diagram;
  className?: string;
  ariaLabel?: string;
};

// Viewbox is always 0,0,100,60. Renderers scale to any container.
// Stroke widths and font sizes are in pitch units (percent of width).
export function DiagramSvg({ diagram, className, ariaLabel }: Props) {
  const { pitch } = diagram;
  const w = pitch.width ?? 100;
  const h = pitch.height ?? 60;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      role="img"
      aria-label={ariaLabel ?? "Football diagram"}
    >
      <defs>
        {/* Arrowheads */}
        <marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
        <marker id="arrow-head-sm" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
        {/* Grass stripes */}
        <pattern id="grass" width="10" height="60" patternUnits="userSpaceOnUse">
          <rect width="5" height="60" fill="#0f5132" />
          <rect x="5" width="5" height="60" fill="#146c43" />
        </pattern>
      </defs>

      {/* Pitch background */}
      <rect x={0} y={0} width={w} height={h} fill="url(#grass)" />

      {pitch.markings && <PitchMarkings width={w} height={h} preset={pitch.preset} />}

      {/* Order matters: zones and equipment at bottom, players on top */}
      {diagram.zones.map((z) => (
        <ZoneShape key={z.id} zone={z} />
      ))}
      {diagram.equipment.map((e) => (
        <EquipmentShape key={e.id} item={e} />
      ))}
      {diagram.mannequins.map((m) => (
        <MannequinShape key={m.id} item={m} />
      ))}
      {diagram.minigoals.map((g) => (
        <MiniGoalShape key={g.id} item={g} />
      ))}
      {diagram.cones.map((c) => (
        <ConeShape key={c.id} cone={c} />
      ))}
      {diagram.arrows.map((a) => (
        <ArrowShape key={a.id} arrow={a} />
      ))}
      {diagram.balls.map((b) => (
        <BallShape key={b.id} ball={b} />
      ))}
      {diagram.players.map((p) => (
        <PlayerShape key={p.id} player={p} />
      ))}
      {diagram.labels.map((l) => (
        <LabelShape key={l.id} label={l} />
      ))}
    </svg>
  );
}

function PitchMarkings({ width: w, height: h, preset }: { width: number; height: number; preset: string }) {
  const lineColor = "#ffffff";
  const stroke = 0.25;

  if (preset === "half" || preset === "quarter") {
    // Simplified, draw outline + halfway-style line on the right edge.
    return (
      <g fill="none" stroke={lineColor} strokeWidth={stroke}>
        <rect x={0.5} y={0.5} width={w - 1} height={h - 1} />
        {preset === "half" && (
          <>
            <rect x={0} y={h / 2 - 15} width={17} height={30} />
            <rect x={0} y={h / 2 - 7.5} width={6} height={15} />
            <circle cx={12} cy={h / 2} r={0.4} fill={lineColor} />
          </>
        )}
      </g>
    );
  }

  // Full pitch (default).
  return (
    <g fill="none" stroke={lineColor} strokeWidth={stroke}>
      {/* Outline */}
      <rect x={0.5} y={0.5} width={w - 1} height={h - 1} />
      {/* Halfway line */}
      <line x1={w / 2} y1={0.5} x2={w / 2} y2={h - 0.5} />
      {/* Centre circle + spot */}
      <circle cx={w / 2} cy={h / 2} r={9} />
      <circle cx={w / 2} cy={h / 2} r={0.5} fill={lineColor} />
      {/* Left 18-yard box */}
      <rect x={0.5} y={h / 2 - 15} width={16.5} height={30} />
      {/* Left 6-yard box */}
      <rect x={0.5} y={h / 2 - 7.5} width={5.5} height={15} />
      {/* Left penalty spot */}
      <circle cx={12} cy={h / 2} r={0.5} fill={lineColor} />
      {/* Left penalty arc (only the part outside the box) */}
      <path d={`M 17 ${h / 2 - 6} A 9 9 0 0 1 17 ${h / 2 + 6}`} />
      {/* Right 18-yard box */}
      <rect x={w - 17} y={h / 2 - 15} width={16.5} height={30} />
      {/* Right 6-yard box */}
      <rect x={w - 6} y={h / 2 - 7.5} width={5.5} height={15} />
      {/* Right penalty spot */}
      <circle cx={w - 12} cy={h / 2} r={0.5} fill={lineColor} />
      {/* Right penalty arc */}
      <path d={`M ${w - 17} ${h / 2 - 6} A 9 9 0 0 0 ${w - 17} ${h / 2 + 6}`} />
      {/* Goals */}
      <rect x={-1.2} y={h / 2 - 3.5} width={1.2} height={7} fill={lineColor} opacity={0.9} />
      <rect x={w} y={h / 2 - 3.5} width={1.2} height={7} fill={lineColor} opacity={0.9} />
    </g>
  );
}

function ZoneShape({ zone }: { zone: Zone }) {
  const dash = zone.style === "dashed" ? "1 0.6" : undefined;
  if (zone.shape === "rect") {
    const width = zone.width ?? 10;
    const height = zone.height ?? 10;
    return (
      <g>
        <rect
          x={zone.x}
          y={zone.y}
          width={width}
          height={height}
          fill={zone.color}
          fillOpacity={0.08}
          stroke={zone.color}
          strokeWidth={0.3}
          strokeDasharray={dash}
        />
        {zone.label && (
          <text x={zone.x + width / 2} y={zone.y + height / 2} fontSize={2} fill={zone.color} textAnchor="middle" dominantBaseline="central" fontWeight={600}>
            {zone.label}
          </text>
        )}
      </g>
    );
  }
  const radius = zone.radius ?? 5;
  return (
    <g>
      <circle cx={zone.x} cy={zone.y} r={radius} fill={zone.color} fillOpacity={0.08} stroke={zone.color} strokeWidth={0.3} strokeDasharray={dash} />
      {zone.label && (
        <text x={zone.x} y={zone.y} fontSize={2} fill={zone.color} textAnchor="middle" dominantBaseline="central" fontWeight={600}>
          {zone.label}
        </text>
      )}
    </g>
  );
}

const CONE_COLORS: Record<string, string> = {
  yellow: "#ffd400",
  red: "#ef4444",
  blue: "#3b82f6",
  white: "#ffffff",
  orange: "#fb923c",
  green: "#22c55e",
};

function ConeShape({ cone }: { cone: Cone }) {
  const color = CONE_COLORS[cone.color] ?? "#ffd400";
  if (cone.size === "flat") {
    return <circle cx={cone.x} cy={cone.y} r={0.9} fill={color} stroke="#000" strokeWidth={0.1} />;
  }
  // Tall cone, triangle
  const s = 1.6;
  return (
    <polygon
      points={`${cone.x - s},${cone.y + s * 0.8} ${cone.x + s},${cone.y + s * 0.8} ${cone.x},${cone.y - s}`}
      fill={color}
      stroke="#000"
      strokeWidth={0.1}
    />
  );
}

const TEAM_FILL: Record<string, string> = {
  red: "#dc2626",
  blue: "#1d4ed8",
  yellow: "#facc15",
  neutral: "#e5e7eb",
};

function PlayerShape({ player }: { player: Player }) {
  const fill = player.role === "gk" ? "#84cc16" : TEAM_FILL[player.team] ?? "#dc2626";
  const textFill = player.team === "yellow" || player.team === "neutral" ? "#111827" : "#ffffff";
  const r = 2;
  return (
    <g>
      <circle cx={player.x} cy={player.y} r={r} fill={fill} stroke="#111827" strokeWidth={0.2} />
      {player.label && (
        <text x={player.x} y={player.y} fontSize={1.8} fontWeight={700} fill={textFill} textAnchor="middle" dominantBaseline="central">
          {player.label}
        </text>
      )}
      {player.hasBall && (
        <circle cx={player.x + r + 0.3} cy={player.y + r + 0.3} r={0.9} fill="#ffffff" stroke="#111827" strokeWidth={0.15} />
      )}
      {player.role === "server" && (
        <text x={player.x} y={player.y + r + 1.8} fontSize={1.4} fill="#ffffff" textAnchor="middle">S</text>
      )}
    </g>
  );
}

function BallShape({ ball }: { ball: Ball }) {
  return (
    <g>
      <circle cx={ball.x} cy={ball.y} r={0.9} fill="#ffffff" stroke="#111827" strokeWidth={0.15} />
      <polygon
        points={`${ball.x},${ball.y - 0.4} ${ball.x + 0.38},${ball.y - 0.12} ${ball.x + 0.23},${ball.y + 0.32} ${ball.x - 0.23},${ball.y + 0.32} ${ball.x - 0.38},${ball.y - 0.12}`}
        fill="#111827"
      />
    </g>
  );
}

function ArrowShape({ arrow }: { arrow: Arrow }) {
  const mx = (arrow.from.x + arrow.to.x) / 2;
  const my = (arrow.from.y + arrow.to.y) / 2;
  // Perpendicular control point for curves.
  const dx = arrow.to.x - arrow.from.x;
  const dy = arrow.to.y - arrow.from.y;
  const len = Math.max(Math.hypot(dx, dy), 0.0001);
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * arrow.curve;
  const cy = my + ny * arrow.curve;

  const d =
    arrow.curve === 0
      ? `M ${arrow.from.x} ${arrow.from.y} L ${arrow.to.x} ${arrow.to.y}`
      : `M ${arrow.from.x} ${arrow.from.y} Q ${cx} ${cy} ${arrow.to.x} ${arrow.to.y}`;

  let dasharray: string | undefined;
  if (arrow.style === "dashed") dasharray = "1.4 0.8";
  if (arrow.style === "wavy") dasharray = "0.5 0.4";

  return (
    <g style={{ color: arrow.color }}>
      <path
        d={d}
        fill="none"
        stroke={arrow.color}
        strokeWidth={0.45}
        strokeDasharray={dasharray}
        strokeLinecap="round"
        markerEnd="url(#arrow-head)"
      />
    </g>
  );
}

const MANN_COLORS: Record<string, string> = {
  blue: "#1e3a8a",
  red: "#991b1b",
  yellow: "#ca8a04",
  white: "#f3f4f6",
  black: "#111827",
};

function MannequinShape({ item }: { item: Mannequin }) {
  const color = MANN_COLORS[item.color] ?? "#1e3a8a";
  return (
    <g>
      <rect x={item.x - 0.6} y={item.y - 2.2} width={1.2} height={4.4} rx={0.3} fill={color} stroke="#000" strokeWidth={0.1} />
      <circle cx={item.x} cy={item.y - 2.4} r={0.7} fill={color} stroke="#000" strokeWidth={0.1} />
    </g>
  );
}

function MiniGoalShape({ item }: { item: MiniGoal }) {
  const w = 5;
  const depth = 1.4;
  let x = item.x - w / 2;
  let y = item.y - depth / 2;
  let width = w;
  let height = depth;
  if (item.facing === "east" || item.facing === "west") {
    x = item.x - depth / 2;
    y = item.y - w / 2;
    width = depth;
    height = w;
  }
  return (
    <rect x={x} y={y} width={width} height={height} fill="#ffffff" fillOpacity={0.35} stroke="#ffffff" strokeWidth={0.25} />
  );
}

function EquipmentShape({ item }: { item: Equipment }) {
  switch (item.type) {
    case "ladder":
      return (
        <g transform={`translate(${item.x} ${item.y}) rotate(${item.rotation})`}>
          <rect x={-6} y={-0.8} width={12} height={1.6} fill="none" stroke="#f97316" strokeWidth={0.2} />
          {[-4, -2, 0, 2, 4].map((i) => (
            <line key={i} x1={i} y1={-0.8} x2={i} y2={0.8} stroke="#f97316" strokeWidth={0.2} />
          ))}
        </g>
      );
    case "hurdle":
      return (
        <g transform={`translate(${item.x} ${item.y}) rotate(${item.rotation})`}>
          <rect x={-1.5} y={-0.3} width={3} height={0.6} fill="#ef4444" stroke="#000" strokeWidth={0.1} />
        </g>
      );
    case "pole":
      return <circle cx={item.x} cy={item.y} r={0.6} fill="#111827" stroke="#ffffff" strokeWidth={0.2} />;
    case "rebounder":
      return (
        <g transform={`translate(${item.x} ${item.y}) rotate(${item.rotation})`}>
          <rect x={-3} y={-0.4} width={6} height={0.8} fill="#64748b" stroke="#000" strokeWidth={0.15} />
          <line x1={-3} y1={0.4} x2={-2.2} y2={1.4} stroke="#64748b" strokeWidth={0.15} />
          <line x1={3} y1={0.4} x2={2.2} y2={1.4} stroke="#64748b" strokeWidth={0.15} />
        </g>
      );
    case "disc":
      return <circle cx={item.x} cy={item.y} r={0.7} fill="#fbbf24" stroke="#000" strokeWidth={0.1} />;
  }
}

function LabelShape({ label }: { label: DiagramLabel }) {
  const size = label.size === "lg" ? 3 : label.size === "sm" ? 1.6 : 2.2;
  return (
    <text x={label.x} y={label.y} fontSize={size} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontWeight={500} style={{ textShadow: "0 0 2px rgba(0,0,0,0.7)" }}>
      {label.text}
    </text>
  );
}
