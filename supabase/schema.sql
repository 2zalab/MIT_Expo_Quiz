-- MIT Expo Quiz - Supabase schema
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  qr_code text not null,
  score integer not null default 0,
  questions_answered integer not null default 0,
  correct_answers integer not null default 0,
  status text not null default 'playing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists players_score_idx on public.players(score desc);
create index if not exists players_qr_idx on public.players(qr_code);

alter table public.players enable row level security;

-- For a public expo MVP, allow anonymous read/insert/update.
-- Tighten these policies before production if sensitive data is collected.
create policy "public read leaderboard"
on public.players for select
to anon, authenticated
using (true);

create policy "public insert players"
on public.players for insert
to anon, authenticated
with check (true);

create policy "public update players"
on public.players for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "public delete players" on public.players;
create policy "public delete players"
on public.players for delete
to anon, authenticated
using (true);

-- Enable Realtime
alter publication supabase_realtime add table public.players;

-- Question bank (import qcm_500_par_categorie_supabase.csv into this table)
create table if not exists public.questions (
  id text primary key,
  category text not null,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  answer_index integer not null,
  points integer not null default 10,
  difficulty text not null default 'facile'
);

create index if not exists questions_category_idx on public.questions(category);

alter table public.questions enable row level security;

create policy "public read questions"
on public.questions for select
to anon, authenticated
using (true);

-- Draw random questions, optionally filtered by category
create or replace function get_random_questions(
  question_limit integer default 10,
  category_filter text default null
)
returns table (
  id text,
  category text,
  question text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  answer_index integer,
  points integer,
  difficulty text
)
language sql
as $$
  select
    q.id,
    q.category,
    q.question,
    q.option_a,
    q.option_b,
    q.option_c,
    q.option_d,
    q.answer_index,
    q.points,
    q.difficulty
  from public.questions q
  where category_filter is null or q.category = category_filter
  order by random()
  limit question_limit;
$$;
