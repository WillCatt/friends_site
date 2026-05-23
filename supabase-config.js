// ─────────────────────────────────────────────────────────────
// Supabase config. Fill these in to enable real-time sync + auth.
// When BOTH are blank the diary runs in local-only mode using
// localStorage — fine for previewing, no shared edits.
// ─────────────────────────────────────────────────────────────
window.DIARY_CONFIG = {
  // From your Supabase project: Project Settings → API → "Project URL"
  SUPABASE_URL: 'https://duujsvmdrtezsggaczpk.supabase.co',
  // From the same page: "Project API keys" → "anon" / "public"
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVocmpsb3dteHhjZnp4cWJzcm5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDg5MTQsImV4cCI6MjA5NDcyNDkxNH0.WclKf1-ByLbTXEnBxA-sbnjXG5at049390UhI_nEY1k',

  // Name of the Storage bucket you created for diary photos.
  // (See SETUP.md step 3.)
  PHOTOS_BUCKET: 'diary-photos',

  // The three editor accounts you create in Supabase Auth.
  // The diary will pretty-print these names instead of raw emails.
  EDITORS: {
    'wcatt98@gmail.com.com': { name: 'William', kr: '윌', color: '#6b7a4a' },
    // 'jeongmin@example.com': { name: 'Jeongmin', kr: '정민', color: '#213e6c' },
    // 'gyubo@example.com': { name: 'Hailey · 규보', kr: '규보', color: '#d44a35' },
  },
};
