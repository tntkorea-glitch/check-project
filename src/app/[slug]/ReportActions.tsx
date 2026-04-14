"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ReviewStatus } from "@/lib/supabase";

const STATUS: { key: ReviewStatus; label: string; cls: string }[] = [
  { key: "unreviewed", label: "미확인",   cls: "bg-gray-100 text-gray-700 border-gray-300" },
  { key: "pending",    label: "적용전",   cls: "bg-amber-100 text-amber-800 border-amber-300" },
  { key: "reviewed",   label: "확인",     cls: "bg-blue-100 text-blue-800 border-blue-300" },
  { key: "applied",    label: "적용완료", cls: "bg-green-100 text-green-800 border-green-300" },
];

export default function ReportActions({
  reportId,
  initial,
}: {
  reportId: number;
  initial: ReviewStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ReviewStatus>(initial);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const update = (next: ReviewStatus) => {
    if (next === status) return;
    const prev = status;
    setStatus(next);
    setError(null);
    start(async () => {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ review_status: next }),
      });
      if (!res.ok) {
        setStatus(prev);
        setError("상태 변경 실패");
      } else {
        router.refresh();
      }
    });
  };

  const remove = () => {
    if (!confirm("이 보고서를 삭제하시겠습니까? 되돌릴 수 없습니다.")) return;
    start(async () => {
      const res = await fetch(`/api/reports/${reportId}`, { method: "DELETE" });
      if (!res.ok) {
        setError("삭제 실패");
      } else {
        router.refresh();
      }
    });
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      <div className="flex items-center gap-1">
        {STATUS.map((s) => {
          const active = status === s.key;
          return (
            <button
              key={s.key}
              type="button"
              disabled={pending}
              onClick={() => update(s.key)}
              className={`text-xs px-2 py-1 rounded border transition ${
                active
                  ? `${s.cls} font-semibold shadow-sm ring-1 ring-offset-1 ring-current/20`
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
              }`}
              title={s.label}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={remove}
        disabled={pending}
        className="text-xs px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        삭제
      </button>

      {error && <span className="text-xs text-red-600 ml-2">{error}</span>}
    </div>
  );
}
