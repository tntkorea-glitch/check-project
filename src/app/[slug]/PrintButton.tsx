"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="text-xs px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 print:hidden"
    >
      🖨 인쇄
    </button>
  );
}
