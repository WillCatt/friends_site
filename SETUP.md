# 셋이 멜번에서 · Setup guide

This is your scrapbook diary. Out of the box it runs locally — open
`index.html` and edit anything: drop images onto polaroid
slots, click captions, add post-its, sign the guestbook. Everything
saves to your browser only.

To **share it with 정민 and 규보** so all three of you build it together,
follow the steps below. Total time: ~15 minutes.

---

## Step 1 — Create a free Supabase project

1. Go to <https://supabase.com> → **Start your project**.
2. Sign in with GitHub or email. Create a new organization (free tier).
3. **New project** → pick a name (e.g. `melbourne-diary`), set a strong
   database password, choose the closest region. Wait ~2 minutes for it
   to provision.

## Step 2 — Run the SQL

In the Supabase dashboard, open **SQL Editor** → **New query**, paste
the block below, hit **Run**.

```sql
-- One-row table holding the entire diary as a JSON document.
create table public.diary_state (
  id          integer primary key default 1,
  content     jsonb   not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

-- Seed the single row.
insert into public.diary_state (id, content) values (1, '{}'::jsonb)
on conflict (id) do nothing;

-- Lock it down: only signed-in users can read / write.
alter table public.diary_state enable row level security;

create policy "diary_state_select"  on public.diary_state for select
  using (auth.role() = 'authenticated');

create policy "diary_state_update"  on public.diary_state for update
  using (auth.role() = 'authenticated');

-- Enable real-time on the table so all browsers see changes live.
alter publication supabase_realtime add table public.diary_state;
```

## Step 3 — Create the photo storage bucket

1. Sidebar → **Storage** → **New bucket**.
2. Name it **`diary-photos`**. Toggle **Public bucket** ON
   (photos load via plain `<img>`, no auth juggling).
3. Create the bucket.
4. Click into the bucket → **Policies** → **New policy** → use the
   "Authenticated users can upload" template. Save.

That's it for storage — uploads now go to this bucket, public reads
work for everyone.

## Step 4 — Create the three editor accounts

Sidebar → **Authentication** → **Users** → **Add user** → **Create
new user**. Make three of them, one for each of you:

| Email | Password | Person |
|---|---|---|
| `will@…`     | (you set)  | William |
| `jeongmin@…` | (you set)  | 정민 |
| `gyubo@…`    | (you set)  | 규보 |

Tip: under **Authentication → Providers**, turn OFF the "Confirm email"
requirement so accounts are usable immediately.

## Step 5 — Wire the keys into the site

1. Supabase sidebar → **Project Settings → API**.		
2. Copy the **Project URL** and the **`anon` `public`** key.
3. Open **`supabase-config.js`** in this project and fill them in:

```js
window.DIARY_CONFIG = {
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGc...your-anon-key...',

  PHOTOS_BUCKET: 'diary-photos',

  EDITORS: {
    'will@yourmail.com':     { name: 'William', kr: '윌',   color: '#6b7a4a' },
    'jeongmin@yourmail.com': { name: 'Jeongmin', kr: '정민', color: '#213e6c' },
    'gyubo@yourmail.com':    { name: 'Hailey · 규보', kr: '규보', color: '#d44a35' },
  },
};
```

The anon key is **safe to commit** to a public repo — that's what it's
designed for. The only thing it can do is what your RLS policies allow,
which is "read/write the diary if signed in".

## Step 6 — Host it

The site is a folder of plain files (no build step). Drag-drop hosts
that work in 30 seconds:

- **Netlify Drop** — <https://app.netlify.com/drop>: drag the project
  folder onto the page. You get `https://your-name.netlify.app` instantly.
- **Vercel** — `npx vercel` in the project folder, follow prompts.
- **Cloudflare Pages** — connect a GitHub repo with these files.
- **GitHub Pages** — push to a repo, enable Pages in repo settings. The
  root URL serves `index.html`, which is the final diary app.

Send the URL to your friends. Each visits, clicks **SIGN IN TO EDIT**,
puts in their account, and edits live. Changes show up in everyone's
browser within ~1 second.

## What's editable

| Page | What you can edit | How |
|---|---|---|
| **02 Photos** | Drop image onto any polaroid, edit caption, add/delete polaroids, drag-rearrange | Inline, in edit mode |
| **07 Inside jokes** | Edit each quote, add new ones, delete | Inline |
| **09 Guestbook** | Sign (no auth needed for guests), delete entries | Always on |
| Others (Cover, Food, Map, Timeline, Playlist, Letters) | Static for now — easy to extend (see below) | — |

### Extending to other sections

Each section is a React component in `scrapbook.jsx`, `scrapbook-more.jsx`,
or `scrapbook-final.jsx`. The pattern to make any piece of text editable:

```jsx
// Before — hardcoded:
<h2>Our melbourne map</h2>

// After — store-driven + editable:
const store = window.useStore?.();
const value = store?.content?.map?.title ?? 'Our melbourne map';
<EditableText
  tag="h2"
  value={value}
  onChange={(v) => store?.update('map.title', v)} />
```

For lists (food entries, map pins, playlist tracks), copy the pattern from
`ScrapbookJokes` in `scrapbook-final.jsx`: read the list from
`store.content.jokes`, render each with `<EditableText>` for the editable
fields, add an `<AddButton>` that calls `store.addItem('jokes', {...})`.

The full content tree (and defaults) is in `store.jsx` — it's the
authoritative shape. Add new sections (e.g. `letters`) there and they'll
sync automatically.

## How it works (the very short version)

- All editable state lives in a single `content` JSON document.
- That document is mirrored to:
  1. `localStorage` in each browser (instant, works offline)
  2. one row in Supabase (`diary_state.id = 1`)
- Each browser opens a Supabase real-time channel; any UPDATE to that
  row pushes to all other browsers within ~1 second.
- Images go to Supabase Storage; only the public URL is stored in the
  JSON.
- Auth is plain email/password; we use the user's email to look up a
  display name from the `EDITORS` map in config.

## When something goes wrong

- **"SIGN IN TO EDIT" stays grayed out**: `supabase-config.js` is empty
  or the keys are wrong. Open the file, paste keys, refresh.
- **Sign-in fails with "Email not confirmed"**: turn off email
  confirmation in **Authentication → Providers** in Supabase, or open
  the user in the dashboard and click "Confirm user".
- **Photo upload says "Upload failed"**: storage bucket missing or
  policies wrong. Re-check Step 3.
- **Edits don't sync to other browsers**: real-time wasn't enabled on
  the table — re-run the last SQL line from Step 2.
- **Wipe everything and start over**: in SQL Editor:
  `update public.diary_state set content = '{}'::jsonb where id = 1;`
  (next page load will reseed defaults).

— have fun. take more photos of jeongmin laughing. 🧡
