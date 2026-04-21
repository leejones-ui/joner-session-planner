import { NextResponse } from "next/server";
import { Session } from "@/lib/schema/session";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 501 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Session.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid session", issues: parsed.error.issues }, { status: 400 });
  }
  const session = parsed.data;

  const supabase = getSupabase();
  const { error } = await supabase.from("sessions").upsert(
    {
      id: session.id,
      prompt: session.prompt,
      title: session.title,
      objective: session.objective,
      blocks: session.blocks,
      total_duration: session.totalDuration,
      created_at: session.createdAt,
    },
    { onConflict: "id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: session.id });
}
