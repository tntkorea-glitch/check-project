---
name: Project init
description: check-project 초기 셋업 — 2026-04-14 /new 스킬로 생성
type: project
originSessionId: 461a4ff1-08e3-4a06-87cb-35ed14ff0b60
---
- 생성일: 2026-04-14
- 프로젝트명: check-project
- GitHub: https://github.com/tntkorea-glitch/check-project
- 스택: Next.js 15 App Router + TypeScript + Tailwind + src/ 디렉토리
- 자동 훅: SessionStart(pull) / Stop(commit+push) 설정 완료
- 인앱 브라우저 가드: public/inapp-guard.js 적용 (layout.tsx beforeInteractive)
- 배포: Vercel (vercel.json 생성됨, link는 setup.sh 에서 수행)
- 로그인: NextAuth v5 (beta) + GoogleProvider, JWT 세션, `/login` 페이지. 카카오/네이버는 UI만(alert)
- AUTH_SECRET: 로컬/Vercel production 등록 완료 (2026-04-14)
- AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET: 사용자가 Google Cloud Console에서 발급 후 `.env.local` + Vercel 에 직접 입력 필요
