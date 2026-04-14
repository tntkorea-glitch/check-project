-- check-project-hub: 프로젝트 리포팅 허브 스키마
-- Supabase SQL Editor에 그대로 붙여넣고 실행

-- ==============================
-- 1. projects: 프로젝트 마스터
-- ==============================
create table if not exists projects (
  slug             text primary key,
  name             text not null,
  description      text,
  status           text not null default 'active' check (status in ('active','paused','archived')),
  progress_percent int  not null default 0 check (progress_percent between 0 and 100),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ==============================
-- 2. reports: 일일 리포트 (/bye 때마다 insert)
-- ==============================
create table if not exists reports (
  id             bigserial primary key,
  project_slug   text not null references projects(slug) on delete cascade,
  report_date    date not null default current_date,
  today_work     text,
  remaining_work text,
  next_work      text,
  raw_markdown   text,
  created_at     timestamptz not null default now()
);

create index if not exists reports_project_date_idx
  on reports (project_slug, report_date desc);

create index if not exists reports_created_at_idx
  on reports (created_at desc);

-- ==============================
-- 3. RLS: 서버 service_role 로만 쓰기/읽기
-- ==============================
alter table projects enable row level security;
alter table reports  enable row level security;

-- anon/authenticated 는 막고 service_role 로만 접근 (기본 동작)
-- 필요 시 읽기 공개하려면 아래 주석 해제:
-- create policy "public read projects" on projects for select using (true);
-- create policy "public read reports"  on reports  for select using (true);

-- ==============================
-- 4. upsert 편의를 위한 updated_at 트리거
-- ==============================
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_touch_updated_at on projects;
create trigger projects_touch_updated_at
  before update on projects
  for each row execute function touch_updated_at();
