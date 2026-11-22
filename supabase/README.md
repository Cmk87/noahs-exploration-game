# Family sync (Supabase)

The game stays a static site. Two devices share progress only after this
table exists and `js/sync-config.js` has the project URL and the anon key.

The anon key is safe to put in the app. The table has row level security
and no policies, so the key cannot read the table. It can only call
`sync_pull` and `sync_push`, and each call has to name the SHA-256 of a
family code.

## What to run

Open the Supabase SQL editor for the project and run the whole file:

`supabase/migrations/20261122130000_family_sync.sql`

## What to fill in

In `js/sync-config.js`:

- `SYNC_URL` — Project URL, for example `https://abcdefgh.supabase.co`
- `SYNC_ANON_KEY` — the anon public key (Project Settings → API keys)

Do not put the service role key in the app.

Then publish the site as usual. Until both values are set, the parent
screen shows “not set up yet” and nothing is sent.
