// ─────────────────────────────────────────────────────────────
// Supabase config. Fill these in to enable real-time sync + auth.
// When BOTH are blank the diary runs in local-only mode using
// localStorage — fine for previewing, no shared edits.
// ─────────────────────────────────────────────────────────────
window.DIARY_CONFIG = {
  // From your Supabase project: Project Settings → API → "Project URL"
  SUPABASE_URL: 'https://ehrjlowmxxcfzxqbsrnf.supabase.co',
  // From the same page: "Project API keys" → "anon" / "public"
  SUPABASE_ANON_KEY: 'sb_publishable_8zlDj9xtYmXA5iB9wKq_0g_grYs8Gzi',

  // Name of the Storage bucket you created for diary photos.
  // (See SETUP.md step 3.)
  PHOTOS_BUCKET: 'diary-photos',

  // The three editor accounts you create in Supabase Auth.
  // The diary will pretty-print these names instead of raw emails.
  EDITORS: {
    'wcatt98@gmail.com': { name: 'William', kr: '윌', color: '#6b7a4a' },
    // 'jeongmin@example.com': { name: 'Jeongmin', kr: '정민', color: '#213e6c' },
    // 'gyubo@example.com': { name: 'Hailey · 규보', kr: '규보', color: '#d44a35' },
  },
};
