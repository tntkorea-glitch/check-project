import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
}

export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export type Project = {
  slug: string;
  name: string;
  description: string | null;
  status: "active" | "paused" | "archived";
  progress_percent: number;
  created_at: string;
  updated_at: string;
};

export type ReviewStatus = "unreviewed" | "pending" | "reviewed" | "applied";

export type Report = {
  id: number;
  project_slug: string;
  report_date: string;
  today_work: string | null;
  remaining_work: string | null;
  next_work: string | null;
  raw_markdown: string | null;
  review_status: ReviewStatus;
  created_at: string;
};
