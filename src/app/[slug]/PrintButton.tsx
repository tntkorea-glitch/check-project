"use client";

export default function PrintButton({ targetId }: { targetId: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        document.body.setAttribute("data-print-only", targetId);
        window.print();
        setTimeout(() => document.body.removeAttribute("data-print-only"), 500);
      }}
      className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 print:hidden"
    >
      🖨 이 보고서 인쇄
    </button>
  );
}
