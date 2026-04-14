"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">로그인</h1>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.6 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5z"/>
            </svg>
            <span>구글로 로그인</span>
          </button>

          <button
            type="button"
            onClick={() => alert("카카오 로그인은 준비 중입니다")}
            className="w-full h-12 flex items-center justify-center gap-3 bg-[#FEE500] rounded-lg font-medium hover:brightness-95 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#000" d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.9 5.3 4.7 6.7-.2.7-.8 2.8-.9 3.2 0 0-.1.4.2.6.3.2.7 0 .7 0 .6-.1 3-2 4-2.8.5 0 .9.1 1.3.1 5.5 0 10-3.6 10-8s-4.5-8-10-8z"/>
            </svg>
            <span>카카오로 로그인</span>
          </button>

          <button
            type="button"
            onClick={() => alert("네이버 로그인은 준비 중입니다")}
            className="w-full h-12 flex items-center justify-center gap-3 bg-[#03C75A] text-white rounded-lg font-medium hover:brightness-95 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#fff" d="M14 4v7.5L10 4H4v16h6v-7.5L14 20h6V4z"/>
            </svg>
            <span>네이버로 로그인</span>
          </button>
        </div>
      </div>
    </main>
  );
}
