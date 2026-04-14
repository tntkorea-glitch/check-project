import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabase, type Project, type Report } from "@/lib/supabase";
import PrintButton from "./PrintButton";
import ReportActions from "./ReportActions";

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

  const list = (reports ?? []) as Report[];
  const total = list.length;

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <Link href="/" className="text-sm text-gray-600 underline">← 대시보드</Link>
          <p className="text-xs text-gray-500">{session.user.email}</p>
        </div>

        {list.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow-sm">
            아직 수신된 리포트가 없습니다.
          </div>
        ) : (
          list.map((r, idx) => (
            <ReportDocument
              key={r.id}
              project={p}
              report={r}
              reportNo={total - idx}
              totalCount={total}
            />
          ))
        )}
      </div>
    </main>
  );
}

function ReportDocument({
  project,
  report,
  reportNo,
  totalCount,
}: {
  project: Project;
  report: Report;
  reportNo: number;
  totalCount: number;
}) {
  const createdAt = new Date(report.created_at).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article
      className="bg-white shadow-sm print:shadow-none rounded-none border border-gray-300 print:border-black print:break-after-page"
      id={`report-${report.id}`}
    >
      {/* 보고서 헤더 */}
      <header className="border-b-2 border-gray-900 px-8 pt-8 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs tracking-widest text-gray-500 mb-2">DAILY WORK REPORT</p>
            <h1 className="text-2xl font-bold">일일 업무 보고서</h1>
          </div>
          <div className="text-right text-xs text-gray-600 leading-relaxed">
            <p>
              보고번호 <span className="font-mono text-gray-900">#{String(reportNo).padStart(3, "0")}</span>
              <span className="text-gray-400"> / {totalCount}</span>
            </p>
            <p>보고일자 <span className="font-mono text-gray-900">{report.report_date}</span></p>
          </div>
        </div>

        <table className="w-full mt-4 text-sm border-t border-gray-200">
          <tbody>
            <MetaRow label="프로젝트">
              <span className="font-semibold">{project.name}</span>
              <span className="ml-2 text-xs text-gray-500 font-mono">({project.slug})</span>
            </MetaRow>
            {project.description && (
              <MetaRow label="개요">{project.description}</MetaRow>
            )}
            <MetaRow label="상태 / 진행률">
              <div className="flex items-center gap-3">
                <StatusBadge status={project.status} />
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[200px]">
                    <div
                      className="h-full bg-gray-900"
                      style={{ width: `${project.progress_percent}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm">{project.progress_percent}%</span>
                </div>
              </div>
            </MetaRow>
          </tbody>
        </table>
      </header>

      {/* 본문 */}
      <section className="px-8 py-6 space-y-6">
        <Block no="1" title="금일 수행 업무" text={report.today_work} />
        <Block no="2" title="미해결 / 잔여 과제" text={report.remaining_work} />
        <Block no="3" title="차기 예정 업무" text={report.next_work} />

        {report.raw_markdown && (
          <details className="print:hidden text-xs text-gray-500 border-t pt-4">
            <summary className="cursor-pointer select-none">원본 로그 보기</summary>
            <pre className="mt-3 whitespace-pre-wrap bg-gray-50 p-3 rounded border text-gray-700">
              {report.raw_markdown}
            </pre>
          </details>
        )}
      </section>

      {/* 푸터 */}
      <footer className="border-t border-gray-300 px-8 py-3 flex items-center justify-between text-xs text-gray-500">
        <p>
          작성일시 <span className="font-mono">{createdAt}</span>
          <span className="mx-2">·</span>
          자동 수집 (Claude Code <code>/bye</code>)
        </p>
        <PrintButton />
      </footer>
    </article>
  );
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <th className="text-left text-xs font-medium text-gray-500 py-2 w-32 align-top">{label}</th>
      <td className="py-2 text-gray-800">{children}</td>
    </tr>
  );
}

function Block({ no, title, text }: { no: string; title: string; text: string | null }) {
  return (
    <div>
      <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
        <span className="inline-block w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-mono">
          {no}
        </span>
        {title}
      </h2>
      <div className="pl-7 text-sm whitespace-pre-wrap leading-relaxed text-gray-800">
        {text?.trim() ? text : <span className="text-gray-400">— 해당 없음 —</span>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map = {
    active:   { text: "진행중", cls: "bg-green-100 text-green-800 border-green-200" },
    paused:   { text: "보류",   cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    archived: { text: "종료",   cls: "bg-gray-100 text-gray-600 border-gray-200" },
  };
  const s = map[status] ?? map.active;
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${s.cls} font-medium`}>
      {s.text}
    </span>
  );
}
