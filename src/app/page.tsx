import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { supabase, type Project, type Report } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const ALLOWED_EMAIL = process.env.ALLOWED_EMAIL;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  if (ALLOWED_EMAIL && session.user.email !== ALLOWED_EMAIL) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <p className="text-gray-700">접근 권한이 없는 계정입니다.</p>
          <p className="text-xs text-gray-500">{session.user.email}</p>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <button className="text-sm underline text-gray-600">다른 계정으로 로그인</button>
          </form>
        </div>
      </main>
    );
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  const slugs = (projects ?? []).map((p) => p.slug);
  const { data: latestReports } = slugs.length
    ? await supabase
        .from("reports")
        .select("*")
        .in("project_slug", slugs)
        .order("created_at", { ascending: false })
    : { data: [] as Report[] };

  const latestBySlug = new Map<string, Report>();
  for (const r of (latestReports ?? []) as Report[]) {
    if (!latestBySlug.has(r.project_slug)) latestBySlug.set(r.project_slug, r);
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">프로젝트 리포트 허브</h1>
            <p className="text-sm text-gray-500">총 {projects?.length ?? 0}개 프로젝트</p>
          </div>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }); }}>
            <button className="text-sm text-gray-600 underline">로그아웃 ({session.user.email})</button>
          </form>
        </header>

        {(!projects || projects.length === 0) ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm">
            아직 수신된 리포트가 없습니다.<br />
            각 프로젝트에서 <code className="bg-gray-100 px-1 rounded">/bye</code> 실행 시 자동 수집됩니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(projects as Project[]).map((p) => {
              const r = latestBySlug.get(p.slug);
              return (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-5 space-y-3 block"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-semibold text-lg">{p.name}</h2>
                      <p className="text-xs text-gray-500">{p.slug}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>진행률</span>
                      <span className="font-medium">{p.progress_percent}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${p.progress_percent}%` }}
                      />
                    </div>
                  </div>

                  {r ? (
                    <div className="text-xs text-gray-600 space-y-1 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">최근: {r.report_date}</p>
                        <ReviewBadge status={r.review_status} />
                      </div>
                      {r.next_work && (
                        <p className="line-clamp-2">
                          <span className="text-gray-400">다음: </span>
                          {r.next_work}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 pt-2 border-t">리포트 없음</p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    active:   { text: "진행중", cls: "bg-green-100 text-green-700" },
    paused:   { text: "보류",   cls: "bg-yellow-100 text-yellow-700" },
    archived: { text: "종료",   cls: "bg-gray-200 text-gray-600" },
  };
  const s = map[status] ?? map.active;
  return <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>{s.text}</span>;
}
