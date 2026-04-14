import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type IngestBody = {
  project_slug: string;
  project_name?: string;
  project_description?: string;
  report_date?: string;
  today_work?: string;
  remaining_work?: string;
  next_work?: string;
  raw_markdown?: string;
  progress_percent?: number;
  status?: "active" | "paused" | "archived";
};

export async function POST(req: Request) {
  const secret = req.headers.get("x-report-secret");
  if (!secret || secret !== process.env.REPORT_INGEST_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: IngestBody;
  try {
    body = (await req.json()) as IngestBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.project_slug) {
    return NextResponse.json({ error: "project_slug required" }, { status: 400 });
  }

  const { error: projErr } = await supabase.from("projects").upsert(
    {
      slug: body.project_slug,
      name: body.project_name ?? body.project_slug,
      description: body.project_description ?? null,
      status: body.status ?? "active",
      progress_percent: body.progress_percent ?? 0,
    },
    { onConflict: "slug" }
  );
  if (projErr) {
    return NextResponse.json({ error: projErr.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("reports")
    .insert({
      project_slug: body.project_slug,
      report_date: body.report_date ?? new Date().toISOString().slice(0, 10),
      today_work: body.today_work ?? null,
      remaining_work: body.remaining_work ?? null,
      next_work: body.next_work ?? null,
      raw_markdown: body.raw_markdown ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
