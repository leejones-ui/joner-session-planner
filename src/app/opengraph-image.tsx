import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Joner Session Planner, AI session planning for football coaches.";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#09090b",
          color: "#f4f4f5",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 14,
              background: "#CC0000",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 36,
            }}
          >
            JF
          </div>
          <div
            style={{
              color: "#a1a1aa",
              textTransform: "uppercase",
              letterSpacing: 2,
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            Joner Session Planner
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 1, letterSpacing: -2, display: "flex" }}>
            Plan a football session in
            <span style={{ color: "#a3e635", marginLeft: 20 }}>60 seconds.</span>
          </div>
          <div style={{ fontSize: 28, color: "#d4d4d8" }}>
            Built by Joner Football for coaches who actually coach.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
