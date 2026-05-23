# Launching your Melbourne diary — quick start

Hi! This folder is the whole site. It's plain HTML + JS — **no build
step, no npm**. Serve this folder and open `index.html` in any modern
browser; GitHub Pages will use that file automatically.

There are two ways to run it:

1. **Solo** — open the file locally, edit it, your changes save in
   your browser. Good for a private draft.
2. **Shared with 정민 and 규보** — host the folder online + connect a
   free Supabase backend so all three of you edit together in real
   time. ~15 minutes setup.

---

## Solo (right now, no setup)

You can't double-click an `.html` file with module scripts — most
browsers block that. Run a one-line static server from the folder
instead:

```bash
# In Terminal, cd into this folder, then:
python3 -m http.server 8000
# Visit http://localhost:8000/
```

If you have Node installed:

```bash
npx serve .
# Visit the printed http://localhost:… URL
```

That's it. Click **EDIT** in the top-right to drop photos, edit
captions, add jokes, sign the guestbook. Everything stays in your
browser's localStorage.

> **Heads-up — solo edits are device-only.** Nothing syncs until you
> finish the Supabase setup below. If you clear cookies/site data,
> the edits go with them.

---

## Shared (the real thing — 3 of you collaborating)

Follow **`SETUP.md`** in this folder. It walks you through:

1. Create a free Supabase project
2. Paste 4 lines of SQL to make the table
3. Make a `diary-photos` storage bucket
4. Create accounts for William / 정민 / 규보
5. Paste the keys into `supabase-config.js`
6. Drop the folder onto Netlify (or anywhere)

Send the resulting URL to your friends. They click **SIGN IN TO
EDIT**, log in with their account, and everything they change shows
up on your screen within a second.

---

## File map

| File | What it does |
|---|---|
| `index.html` | **GitHub Pages opens this** — the diary itself |
| `Melbourne Diary.html` | Legacy diary entrypoint; same app, kept for old local links |
| `directions.html` | The original 3-direction design canvas (Scrapbook / Riso / Café) — keep or delete |
| `styles.css` | All visual styling |
| `supabase-config.js` | **Paste your Supabase keys here** |
| `SETUP.md` | Full Supabase + hosting walkthrough |
| `*.jsx` | The React components (you can ignore these unless extending) |

---

## When something looks off

| Symptom | Fix |
|---|---|
| Blank white page | You opened the `.html` file directly. Use the static server (above). |
| "SIGN IN TO EDIT" button is grayed out | No Supabase keys yet — that's expected in solo mode. Click EDIT directly. |
| Changes don't sync to my friend's browser | Supabase keys not filled in, OR the realtime SQL line wasn't run. See SETUP.md step 2. |
| I want to start fresh | In Supabase SQL editor: `update public.diary_state set content = '{}'::jsonb where id = 1;` then refresh. |
| Photo upload fails | Storage bucket missing or not public. Re-do SETUP.md step 3. |

---

## What's editable

When signed in + edit mode on:

- **Cover** — edit title/subtitle/date, cover note, and cover polaroid images/captions
- **Photos** — drop images onto polaroids, edit captions, drag to rearrange, add/delete polaroids
- **Food, Map, Timeline, Playlist, Letters** — edit the visible text and image slots; add entries where the page has an add button
- **Inside jokes** — edit quotes/authors/colors, add new ones, delete
- **Guestbook** — anyone can sign; editors can edit/delete entries

— have fun. ❤️
