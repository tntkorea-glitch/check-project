import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase, type Project, type Report } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  if (ALLOWED_EMAIL && session.user.email !== ALLOWED_EMAIL) redirect("/");

  const { slug } = await params;

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!project) notFound();
  const p = project as Project;

  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("project_slug", slug)
    .order("report_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/" className="text-sm text-gray-500 underline">← 대시보드</Link>
        </div>

        <header className="bg-white rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{p.name}</h1>
              <p className="text-sm text-gray-500">{p.slug}</p>
              {p.description && <p className="mt-2 text-sm text-gray-700">{p.description}</p>}
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              {p.status}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>진행률</span>
              <span className="font-medium">{p.progress_percent}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${p.progress_percent}%` }}
              />
            </div>
          </div>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">리포트 타임라인 ({reports?.length ?? 0})</h2>
          {(!reports || reports.length === 0) ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
              리포트가 없습니다.
            </div>
          ) : (
            <ol className="space-y-3">
              {(reports as Report[]).map((r) => (
                <li key={r.id} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{r.report_date}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleString("ko-KR")}
                    </p>
                  </div>

                  <Section title="오늘 한 작업"  text={r.today_work} />
                  <Section title="남은 작업"    text={r.remaining_work} />
                  <Section title="다음 작업"    text={r.next_work} />

                  {r.raw_markdown && (
                    <details className="text-xs text-gray-500">
                      <summary className="cursor-pointer">원본 리포트 보기</summary>
                      <pre className="mt-2 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                        {r.raw_markdown}
                      </pre>
                    </details>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}

function Section({ title, text }: { title: string; text: string | null }) {
  if (!text) return null;
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <p className="text-sm whitespace-pre-wrap">{text}</p>
    </div>
  );
}
