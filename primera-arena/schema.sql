-- ============================================================================
--  SCHEMA.SQL — Backend Supabase PRIMERA Arena
--  Fork arsitektur dari Sistema (D:/Dev/SPK/game_jkn, 48 mahasiswa FK, terbukti
--  11 Juni 2026) — server-authoritative, realtime via Supabase Postgres-Changes,
--  tanpa server custom. Codebase TERPISAH dari primera-desktop (M8, ROADMAP.md).
--
--  BEDA DARI SISTEMA (disengaja, bukan kelalaian):
--  Sistema = 8 kursi/pod, 5 PERAN asimetris (puskesmas/rs/bpjs/dinkes/pasien)
--  yang saling memberi konsekuensi lintas-peran. PRIMER Arena = SEMUA pemain
--  peran TUNGGAL "puskesmas" (cermin identitas single-player Puskesmas Pagi) —
--  twist multiplayer-nya BUKAN asimetri peran, tapi COMMONS: satu pod = satu
--  "kabupaten" dengan kolam tempat tidur RS yang TERBATAS & DIBAGI semua
--  pemain di pod itu. Rujukan yang terlambat bisa kehabisan bed karena
--  keburu diambil rujukan sekelas ("STEMI-ku merebut kasurmu" — ROADMAP.md
--  butir 37). RS/BPJS/Dinkes jadi SISTEM (RPC atomik), bukan kursi pemain.
--
--  PENILAIAN (prinsip sama dgn Sistema): backend merekam SETIAP keputusan
--  (`actions.eval`) → substrat "Kartu Rapor Keputusan" (BUKTI utk refleksi),
--  BUKAN nilai. Skor in-game TIDAK masuk rumus nilai (cegah min-maxing).
--
--  ⚠️ Semua kapasitas/kelas RS = SIMULASI PEMBELAJARAN (bukan data riil).
--  Jalankan di Supabase SQL Editor. Idempoten (IF NOT EXISTS).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1) game_sessions — Kendali GM (dosen). Klien subscribe phase+event.
-- ----------------------------------------------------------------------------
create table if not exists public.game_sessions (
  id              uuid primary key default gen_random_uuid(),
  kode            text unique not null,                  -- kode join (mis. "FK2026A")
  nama            text not null default 'Sesi PRIMER Arena',
  phase           text not null default 'lobby'
                  check (phase in ('lobby','intro','round','debrief','closed')),
  round           int  not null default 0,
  round_started_at timestamptz,
  current_event   jsonb,                                 -- {type,payload} kartu kejutan; NULL=none
  facilitator_uid uuid,
  config          jsonb not null default '{}'::jsonb,    -- jml_ronde, dll
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2) pod_states — 1 pod = 1 "Kabupaten" (tampil di proyektor). `rs_beds` = KOLAM
--    KOMMONS: { rsId: { nama, kelas, spesialisasi[], bedTotal, bedTerpakai } }.
--    bedTerpakai naik/turun HANYA lewat RPC atomik (klaim_bed/prb_pulangkan) —
--    klien TIDAK BOLEH UPDATE langsung (race condition = inti mekanik).
-- ----------------------------------------------------------------------------
create table if not exists public.pod_states (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references public.game_sessions(id) on delete cascade,
  nomor           int  not null,                         -- 1..N kabupaten
  nama            text not null,
  rs_beds         jsonb not null default '{}'::jsonb,
  tak_tertangani  int  not null default 0,                -- rujukan gagal dpt bed & kadaluarsa
  created_at      timestamptz not null default now(),
  unique (session_id, nomor)
);

-- ----------------------------------------------------------------------------
-- 3) players — Frictionless Lobby (NIM+Nama+Pod+kursi), pola Sistema.
--    ANTI-REBUT KURSI: UNIQUE(pod_id, seat) -> DB menolak kursi yang sudah
--    diambil (race-condition lock; klien tangkap error 23505).
--    v0: SEMUA kursi role='puskesmas' (puskesmas_1..N) + 1 kursi 'gm' opsional.
-- ----------------------------------------------------------------------------
create table if not exists public.players (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.game_sessions(id) on delete cascade,
  pod_id      uuid references public.pod_states(id) on delete set null,
  auth_uid    uuid,                                      -- auth.uid() anonim
  nim         text not null,                              -- Nomor Induk Mahasiswa (resume key)
  nama        text not null,
  seat        text,
  role        text not null default 'puskesmas' check (role in ('puskesmas','gm')),
  online      boolean not null default true,
  joined_at   timestamptz not null default now(),
  unique (session_id, nim),
  unique (pod_id, seat)
);

-- ----------------------------------------------------------------------------
-- 4) referrals — kartu pasien yang dialihkan ke satu pemain per ronde (`status`
--    'baru'), lalu keputusannya: 'tuntas' (selesai di Puskesmas) ATAU 'rujuk'
--    (kirim ke satu RS di kolam komons pod — REBUTAN bed via klaim_bed RPC).
-- ----------------------------------------------------------------------------
create table if not exists public.referrals (
  id           uuid primary key default gen_random_uuid(),
  session_id   uuid not null references public.game_sessions(id) on delete cascade,
  pod_id       uuid not null references public.pod_states(id) on delete cascade,
  round        int  not null default 0,
  player_id    uuid references public.players(id) on delete set null,
  pasien       jsonb not null,                            -- kartu kasus (nama, keluhan, icd10, kegawatan, spesialisasiButuh)
  keputusan    text check (keputusan in ('tuntas','rujuk')),
  chosen_rs_id text,                                      -- target RS di rs_beds pod ini
  eval         jsonb,                                     -- hasil penilaian keputusan (murni, deterministik)
  status       text not null default 'baru'
               check (status in ('baru','tuntas_selesai','menunggu_bed','diterima','ditolak_penuh','pulang','kadaluarsa')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 5) actions — LOG KEPUTUSAN per pemain = substrat penilaian & audit trail.
-- ----------------------------------------------------------------------------
create table if not exists public.actions (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references public.game_sessions(id) on delete cascade,
  pod_id      uuid references public.pod_states(id) on delete set null,
  player_id   uuid references public.players(id) on delete set null,
  round       int  not null default 0,
  type        text not null,            -- 'tuntaskan'|'rujuk'|'klaim_bed_gagal'|'pulangkan'|...
  payload     jsonb not null default '{}'::jsonb,
  eval        jsonb,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- INDEKS
-- ----------------------------------------------------------------------------
create index if not exists idx_pods_session       on public.pod_states(session_id);
create index if not exists idx_players_session    on public.players(session_id);
create index if not exists idx_players_pod        on public.players(pod_id);
create index if not exists idx_referrals_pod_round on public.referrals(pod_id, round);
create index if not exists idx_referrals_player   on public.referrals(player_id, status);
create index if not exists idx_actions_player     on public.actions(player_id);
create index if not exists idx_actions_pod_round  on public.actions(pod_id, round);

-- ----------------------------------------------------------------------------
-- VIEW player_report — "Kartu Rapor Keputusan" (BUKTI utk Refleksi, BUKAN nilai).
-- ----------------------------------------------------------------------------
create or replace view public.player_report as
select
  p.id, p.nim, p.nama, p.pod_id, p.seat,
  count(a.*)                                                          as jml_aksi,
  count(*) filter (where (a.eval->>'score')::int > 0)                 as aksi_tepat,
  coalesce(round(100.0 * count(*) filter (where (a.eval->>'score')::int > 0)
           / nullif(count(*), 0)), 0)                                 as akurasi_persen,
  count(*) filter (where a.type = 'klaim_bed_gagal')                  as gagal_rebut_bed,
  coalesce(sum((a.eval->>'score')::int), 0)                           as skor_proses
from public.players p
left join public.actions a on a.player_id = p.id
group by p.id, p.nim, p.nama, p.pod_id, p.seat;

-- ----------------------------------------------------------------------------
-- REALTIME — sessions(fase+event) · referrals(inbox per-pemain) · pod_states
--   (bed komons, dasbor proyektor) · players(lobby) · actions(ticker opsional).
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['game_sessions','pod_states','players','referrals','actions']
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I;', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- RLS — PERMISIF untuk sesi kelas singkat (anon baca/tulis di balik kode join),
--   pola sama Sistema. Untuk produksi jangka panjang: perketat per-player.
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['game_sessions','pod_states','players','referrals','actions']
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists %1$s_anon_all on public.%1$s;', t);
    execute format('create policy %1$s_anon_all on public.%1$s for all to anon, authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- RPC klaim_bed — JANTUNG mekanik komons. Atomik & idempoten: lock baris pod,
-- cek kapasitas RS yang diminta, kalau ADA sisa naikkan bedTerpakai + tandai
-- referral 'diterima'; kalau PENUH kembalikan {ok:false, reason:'penuh'} TANPA
-- mengubah apa pun (pemain harus pilih RS lain / antre / rujuk balik teman
-- sekelas). Ini yang bikin "STEMI-ku merebut kasurmu" nyata: siapa cepat dia
-- dapat, race condition di-serialize oleh `for update` pada baris pod.
-- ----------------------------------------------------------------------------
create or replace function public.klaim_bed(p_ref uuid, p_rs_id text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r public.referrals%rowtype; beds jsonb; rs jsonb; total int; terpakai int;
begin
  select * into r from public.referrals where id = p_ref for update;
  if r.id is null then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if r.status not in ('baru', 'menunggu_bed') then
    return jsonb_build_object('ok', false, 'reason', 'already_processed');
  end if;

  select rs_beds into beds from public.pod_states where id = r.pod_id for update;
  rs := beds -> p_rs_id;
  if rs is null then return jsonb_build_object('ok', false, 'reason', 'rs_tidak_dikenal'); end if;

  total := coalesce((rs->>'bedTotal')::int, 0);
  terpakai := coalesce((rs->>'bedTerpakai')::int, 0);
  if terpakai >= total then
    update public.referrals set status = 'menunggu_bed', chosen_rs_id = p_rs_id where id = p_ref;
    return jsonb_build_object('ok', false, 'reason', 'penuh', 'total', total, 'terpakai', terpakai);
  end if;

  update public.pod_states
    set rs_beds = jsonb_set(beds, array[p_rs_id, 'bedTerpakai'], to_jsonb(terpakai + 1))
    where id = r.pod_id;
  update public.referrals
    set status = 'diterima', chosen_rs_id = p_rs_id, updated_at = now()
    where id = p_ref;

  return jsonb_build_object('ok', true, 'sisaBed', total - terpakai - 1);
end $$;

-- ----------------------------------------------------------------------------
-- RPC prb_pulangkan — bebaskan 1 bed (pasien sembuh/pulang), atomik dgn
-- perubahan status. Membuka kembali kolam komons utk rujukan berikutnya.
-- ----------------------------------------------------------------------------
create or replace function public.prb_pulangkan(p_ref uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare r public.referrals%rowtype; beds jsonb; rs jsonb; terpakai int;
begin
  select * into r from public.referrals where id = p_ref for update;
  if r.id is null then return jsonb_build_object('ok', false, 'reason', 'not_found'); end if;
  if r.status <> 'diterima' then return jsonb_build_object('ok', false, 'reason', 'already_processed'); end if;

  select rs_beds into beds from public.pod_states where id = r.pod_id for update;
  rs := beds -> r.chosen_rs_id;
  terpakai := greatest(coalesce((rs->>'bedTerpakai')::int, 0) - 1, 0);
  update public.pod_states
    set rs_beds = jsonb_set(beds, array[r.chosen_rs_id, 'bedTerpakai'], to_jsonb(terpakai))
    where id = r.pod_id;
  update public.referrals set status = 'pulang' where id = p_ref;

  return jsonb_build_object('ok', true);
end $$;

-- ----------------------------------------------------------------------------
-- GM TOKEN TERPISAH — TIDAK ikut terbaca klien (cegah leak via DevTools/network).
-- Pola identik Sistema.
-- ----------------------------------------------------------------------------
create table if not exists public.gm_secrets (
  session_id uuid primary key references public.game_sessions(id) on delete cascade,
  token text not null
);
alter table public.gm_secrets enable row level security;

create or replace function public.verify_gm(p_session uuid, p_token text)
returns boolean language sql security definer set search_path = public as $$
  select exists(select 1 from public.gm_secrets where session_id = p_session and token = p_token);
$$;

-- ----------------------------------------------------------------------------
-- RESET (uncomment untuk sesi baru):
-- truncate public.actions, public.referrals, public.players, public.pod_states, public.game_sessions cascade;
-- ----------------------------------------------------------------------------
