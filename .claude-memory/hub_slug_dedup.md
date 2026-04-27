---
name: Hub slug duplication issue
description: 허브 slug 중복 문제 (폴더 rename/대소문자) — 2026-04-25 1차 정리 완료, 예방책 미구현
type: project
originSessionId: f1eab973-edaa-48cc-93c2-110cc343eaf1
---
**문제**: `/bye` 스킬이 `basename "$(pwd)"` 로 project_slug 를 생성해서, 폴더 rename 이나 대소문자 차이가 있으면 허브 DB 에 같은 프로젝트가 2행으로 쌓임.

**2026-04-25 정리 내역** (18개 → 14개):
- video-automation → yutica (리포트 1건 이전)
- auto-instagram → postica (리포트 0건, 구 slug 삭제)
- insta-app → liketica (리포트 0건, 구 slug 삭제)
- naver-contact → contica (리포트 0건, 구 slug 삭제)

**예방책 (미구현)**:
1. 각 프로젝트 루트에 `.project-slug` 파일 두고 `/bye` 스킬이 그걸 우선 읽기
2. `/api/reports` route.ts 에서 slug 소문자 정규화 + alias 매핑 테이블

**Why**: 폴더 rename 은 프로젝트 정체성이 바뀌지 않아도 자주 발생. slug 가 폴더명에 묶여있으면 매번 중복 발생.
**How to apply**: 폴더 rename 감지하면 바로 예방책 구현 권고. 새 중복 발견 시 `D:/dev/check-project` 에서 node 로 service_role 키 직접 호출해서 `UPDATE reports SET project_slug='new' WHERE project_slug='old'` → `DELETE FROM projects WHERE slug='old'` 순서로 처리.
