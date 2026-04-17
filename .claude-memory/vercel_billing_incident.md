---
name: Vercel billing incident
description: 2026-04-18 Vercel Build Minutes 폭주로 $334 과금 — 원인 분석 및 전체 조치 완료
type: project
originSessionId: 7245597b-3372-4d2d-a76b-68448ecd1de5
---
**사건**: 2026-04-18 Vercel Build Minutes 47시간 = $352.30 과금 발견

**원인**:
1. Claude Code 자동 훅(PostToolUse)이 파일 수정할 때마다 commit + push → Vercel 빌드 트리거
2. 같은 GitHub 리포에 Vercel 프로젝트가 2개씩 연결 (1 push = 2 builds)
   - auto_instagram + auto-instagram → 동일 리포
   - video-automation-v2 + video-automation → 동일 리포
3. Pro 플랜은 초과 과금이 자동 멈추지 않음 (Alerts only 상태였음)

**조치 완료**:
- 중복 Vercel 프로젝트 삭제: auto_instagram, video-automation-v2
- 실사용 프로젝트 Git Disconnect: auto-instagram(postica.co.kr), video-automation(yutica.co.kr) — 시범서비스 시 재연결
- 글로벌 settings.json: PostToolUse 훅 전체 제거, Stop 훅에서 push 제거
- 11개 프로젝트 로컬 settings.json: 전부 push 제거
- Spend Budget: $200 → $10, Pause Production Deployments ON
- Support Case 제출: 크레딧 조정 요청 (응답 대기 중)
- `/save` 스킬 생성: commit+push만 (배포 없음), `[save]` 프리픽스로 빌드 스킵 예정

**현재 push/배포 흐름**:
- 평소 작업 → 로컬 commit만 (push 안 됨)
- `/save` → commit + push (배포 없음, PC 이동/백업용)
- `/bye` → commit + push + Vercel 배포 + 리포트

**Why**: auto-commit 훅이 매 파일 수정마다 push하면서 Vercel 빌드가 수백 회 트리거됨
**How to apply**: 새 프로젝트 생성 시 auto-push 훅 절대 넣지 말 것. Vercel 연결된 프로젝트는 /bye 또는 /save로만 push
