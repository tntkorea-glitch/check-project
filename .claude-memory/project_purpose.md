---
name: Project purpose
description: check-project = 사용자의 12~13개 동시 진행 프로젝트 리포팅 허브
type: project
originSessionId: 461a4ff1-08e3-4a06-87cb-35ed14ff0b60
---
**이 프로젝트의 정체성: 리포트 허브 (central hub)**

- 사용자는 현재 D:\dev 아래 12~13개 프로젝트를 동시 진행 중
- 기존: 각 프로젝트 /bye 종료 시 생성된 보고를 수동으로 엑셀에 복붙
- 이 프로젝트 목적: 모든 프로젝트의 세션 종료 리포트를 자동 수집하고 대시보드로 보여주는 허브

**아키텍처**
- DB: Supabase (프로젝트 `xtacxcbqvolxrudihhjc`) — projects + reports 테이블
- API: `POST /api/reports` (x-report-secret 헤더로 인증)
- 대시보드: `/` (프로젝트 카드 그리드) + `/[slug]` (날짜별 타임라인) — Google 로그인 필수
- 전송: `/bye` 스킬(C:\Users\미르\.claude\commands\bye.md)이 세션 종료 시 자동 POST
- 허브 URL: https://check-project-two.vercel.app
- 공용 설정: C:\Users\미르\.claude\hub-config.json (hub_url + ingest_secret)

**Why**: 12~13개 프로젝트 동시 관리 시 엑셀 수동 정리는 유지 불가능 → 자동 집계 필요
**How to apply**: 이 프로젝트에서 기능 변경 시 스키마/API/대시보드/`/bye` 스킬 4곳 영향도 확인. 특히 `/bye` 스킬의 전송 페이로드 포맷 변경 시 reports 테이블 컬럼과 동기화.
