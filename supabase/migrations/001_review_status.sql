-- reports 에 리뷰 상태 컬럼 추가
alter table reports
  add column if not exists review_status text not null default 'unreviewed'
  check (review_status in ('unreviewed','pending','reviewed','applied'));

create index if not exists reports_review_status_idx on reports (review_status);
