import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase, type ReviewStatus } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;
const VALID_STATUS: ReviewStatus[] = ["unreviewed", "pending", "reviewed", "applied"];

async function requireSession() {
  const session = await auth();
  if (!session?.user?.email) return null;
  if (ALLOWED_EMAIL && session.user.email !== ALLOWED_EMAIL) return null;
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const reportId = Number(id);
  if (!Number.isFinite(reportId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  let body: { review_status?: ReviewStatus };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid json" }, { status: 400 }); }

  if (!body.review_status || !VALID_STATUS.includes(body.review_status)) {
    return NextResponse.json({ error: "invalid review_status" }, { status: 400 });
  }

  const { error } = await supabase
    .from("reports")
    .update({ review_status: body.review_status })
    .eq("id", reportId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const reportId = Number(id);
  if (!Number.isFinite(reportId)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const { error } = await supabase.from("reports").delete().eq("id", reportId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
