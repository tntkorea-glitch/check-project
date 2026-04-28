---
name: Production URL
description: check-project 의 진짜 production URL 과 헷갈리기 쉬운 잘못된 URL 정리
type: project
originSessionId: 35182774-9a2b-4d9c-984b-c9a7eb872b16
---
check-project production URL = **https://check-project-two.vercel.app**

**Why:** `check-project.vercel.app` 은 다른 사람이 선점해서 흰 화면이 뜨고, `check-project-<hash>-tntkorea-4169s-projects.vercel.app` 같은 랜덤 URL 은 Google OAuth redirect URI 에 등록 안 돼 있어서 `400 redirect_uri_mismatch` 가 난다. Google OAuth 콘솔에는 `check-project-two.vercel.app` 만 등록돼 있음 (2026-04-27 확인).

**How to apply:** 사용자가 "check-project 사이트 열어줘" 또는 비슷한 요청 시 무조건 `https://check-project-two.vercel.app` 를 열 것. `vercel ls` 결과의 랜덤 URL 이나 `check-project.vercel.app` 추측해서 열지 말 것.
