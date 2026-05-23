// Store — central editable content tree. Syncs to Supabase if configured,
// otherwise persists to localStorage. Sections subscribe to slices.

// ─── Defaults ─────────────────────────────────────────────────
// What you see when the diary is first loaded. Editing in the live
// site replaces these in the cloud; the originals stay in code as a
// "factory reset" target.
const DIARY_DEFAULTS = {
  cover: {
    kicker: 'A SCRAPBOOK · 2026 · MELBOURNE',
    titleA: 'three of us',
    titleB: 'in',
    titleC: 'melbourne',
    subtitleKr: '정민, 규보 & 윌리엄',
    subtitleEn: '우리 셋의 기록',
    dateRange: 'FEB — JUN · 2026',
    postit: '"you bring vegemite,\ni bring 김치"\n— rule of the share house',
  },
  photos: [
    { id: 'p01', slot: 'queen vic mkt · saturday', caption: 'brekkie run', captionKr: '브런치',  rot: -4, tape: 'red',    top: 200, left: 90,   width: 180, imageUrl: null, x: 0, y: 0 },
    { id: 'p02', slot: 'lune · 7:40am queue',      caption: 'lune queue',  captionKr: '크루아상', rot: 3,  tape: 'blue',   top: 190, left: 305,  width: 170, imageUrl: null, x: 0, y: 0 },
    { id: 'p03', slot: 'st kilda pier · golden hr',caption: 'penguins?',   captionKr: '펭귄 어디?',rot: -2, tape: 'yellow', top: 180, left: 510,  width: 200, imageUrl: null, x: 0, y: 0 },
    { id: 'p04', slot: 'naked for satan · pintxos',caption: 'pintxos night',captionKr: '',        rot: 5,  tape: 'red',    top: 180, left: 760,  width: 180, imageUrl: null, x: 0, y: 0 },
    { id: 'p05', slot: 'glen waverley · 한식',     caption: 'k-bbq',       captionKr: '돼지갈비',  rot: -3, tape: 'dots',   top: 190, left: 1000, width: 180, imageUrl: null, x: 0, y: 0 },
    { id: 'p06', slot: 'carlton gardens · picnic', caption: 'picnic',      captionKr: '소풍',     rot: 4,  tape: 'blue',   top: 470, left: 150,  width: 170, imageUrl: null, x: 0, y: 0 },
    { id: 'p07', slot: 'pellegrini\u2019s · 1pm',  caption: 'first granita',captionKr: '',         rot: -3, tape: 'yellow', top: 460, left: 350,  width: 190, imageUrl: null, x: 0, y: 0 },
    { id: 'p08', slot: 'brunswick · winter',       caption: 'cold hands',  captionKr: '추워',     rot: 6,  tape: 'red',    top: 480, left: 590,  width: 180, imageUrl: null, x: 0, y: 0 },
    { id: 'p09', slot: 'ngv · rothko room',        caption: 'just sat there', captionKr: '말없이', rot: -5, tape: 'blue',   top: 470, left: 810,  width: 170, imageUrl: null, x: 0, y: 0 },
    { id: 'p10', slot: 'box hill · bingsu',        caption: 'bingsu run',  captionKr: '빙수',     rot: 2,  tape: 'dots',   top: 480, left: 1020, width: 180, imageUrl: null, x: 0, y: 0 },
  ],
  jokes: [
    { id: 'j1', who: '정민', text: '"you bring vegemite, i bring 김치 — fair trade."', top: 220, left: 110, rot: -4, bg: '#fef4a8', w: 240 },
    { id: 'j2', who: 'will', text: '"is 호주맛 just… caffeine?"',                       top: 235, left: 400, rot: 3,  bg: '#fbd9c9', w: 230 },
    { id: 'j3', who: '규보', text: '"mum\u2019s kimchi is better. always."',            top: 250, left: 700, rot: -2, bg: '#dff0d6', w: 230 },
    { id: 'j4', who: '정민', text: '"magpies are racist toward me specifically."',     top: 250, left: 980, rot: 4,  bg: '#fef4a8', w: 240 },
    { id: 'j5', who: 'will', text: '"lygon st pasta < jeongmin\u2019s ramyeon. okay maybe."', top: 480, left: 90,  rot: 2,  bg: '#fbd9c9', w: 250 },
    { id: 'j6', who: '규보', text: '"australia spelled it \u2018servo\u2019 and i lost my mind."', top: 470, left: 380, rot: -3, bg: '#dff0d6', w: 250 },
    { id: 'j7', who: '정민', text: '"tram 96, my actual home."',                       top: 500, left: 720, rot: 5,  bg: '#cde0f2', w: 200 },
    { id: 'j8', who: 'will', text: '"regulating my emotions via flat whites."',       top: 490, left: 970, rot: -4, bg: '#fef4a8', w: 240 },
  ],
  guestbook: [
    { id: 'g1', name: '정민',  msg: '내 멜번. 내 친구들. 또 봐.',                    rot: -3, color: '#213e6c' },
    { id: 'g2', name: '규보',  msg: 'see you on the other side of the world.',     rot: 2,  color: '#d44a35' },
    { id: 'g3', name: 'will',  msg: 'tram 96 will not be the same.',                rot: -1.5, color: '#6b7a4a' },
  ],
};

// ─── Path helpers (deep get / set immutable) ──────────────────
function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}
function setByPath(obj, path, value) {
  const keys = path.split('.');
  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const child = cur[k];
    cur[k] = Array.isArray(child) ? [...child] : { ...child };
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
  return next;
}

// ─── Supabase client (lazy) ───────────────────────────────────
let _sb = null;
function getSupabase() {
  if (_sb) return _sb;
  const cfg = window.DIARY_CONFIG;
  if (!cfg?.SUPABASE_URL || !cfg?.SUPABASE_ANON_KEY) return null;
  if (!window.supabase) return null;
  _sb = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  return _sb;
}

// ─── Image upload ─────────────────────────────────────────────
async function uploadImage(file) {
  const sb = getSupabase();
  if (!sb) {
    // local fallback — encode as data URL
    return new Promise((res) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(file);
    });
  }
  const cfg = window.DIARY_CONFIG;
  const bucket = cfg.PHOTOS_BUCKET || 'diary-photos';
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await sb.storage.from(bucket).upload(key, file);
  if (error) throw error;
  const { data: pub } = sb.storage.from(bucket).getPublicUrl(data.path);
  return pub.publicUrl;
}

// ─── Store context ────────────────────────────────────────────
const StoreContext = React.createContext(null);

function StoreProvider({ children }) {
  const [content, setContent] = React.useState(DIARY_DEFAULTS);
  const [synced, setSynced] = React.useState('local'); // local | cloud | syncing | error
  const sbRef = React.useRef(null);
  const saveTimer = React.useRef(null);

  // Initial load
  React.useEffect(() => {
    const sb = getSupabase();
    sbRef.current = sb;

    if (!sb) {
      // localStorage fallback
      try {
        const saved = JSON.parse(localStorage.getItem('diary-content') || 'null');
        if (saved) setContent({ ...DIARY_DEFAULTS, ...saved });
      } catch {}
      setSynced('local');
      return;
    }

    (async () => {
      const { data, error } = await sb.from('diary_state').select('content').eq('id', 1).maybeSingle();
      if (error) { console.error(error); setSynced('error'); return; }
      if (data?.content && Object.keys(data.content).length) {
        setContent({ ...DIARY_DEFAULTS, ...data.content });
      } else {
        await sb.from('diary_state').upsert({ id: 1, content: DIARY_DEFAULTS });
      }
      setSynced('cloud');
    })();

    const chan = sb.channel('diary-state')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'diary_state' },
        (payload) => { if (payload.new?.content) setContent({ ...DIARY_DEFAULTS, ...payload.new.content }); })
      .subscribe();
    return () => sb.removeChannel(chan);
  }, []);

  // ─── Update fn — local-first, then debounced cloud push
  const persist = React.useCallback((next) => {
    try { localStorage.setItem('diary-content', JSON.stringify(next)); } catch {}
    const sb = sbRef.current;
    if (!sb) return;
    setSynced('syncing');
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { error } = await sb.from('diary_state')
        .update({ content: next, updated_at: new Date().toISOString() })
        .eq('id', 1);
      setSynced(error ? 'error' : 'cloud');
      if (error) console.error('Save error', error);
    }, 350);
  }, []);

  const update = React.useCallback((path, value) => {
    setContent(prev => {
      const next = setByPath(prev, path, value);
      persist(next);
      return next;
    });
  }, [persist]);

  // List ops
  const addItem = React.useCallback((listPath, item) => {
    setContent(prev => {
      const list = getByPath(prev, listPath) || [];
      const next = setByPath(prev, listPath, [...list, item]);
      persist(next);
      return next;
    });
  }, [persist]);

  const removeItem = React.useCallback((listPath, id) => {
    setContent(prev => {
      const list = getByPath(prev, listPath) || [];
      const next = setByPath(prev, listPath, list.filter(x => x.id !== id));
      persist(next);
      return next;
    });
  }, [persist]);

  const updateItem = React.useCallback((listPath, id, patch) => {
    setContent(prev => {
      const list = getByPath(prev, listPath) || [];
      const idx = list.findIndex(x => x.id === id);
      if (idx === -1) return prev;
      const updated = [...list];
      updated[idx] = { ...updated[idx], ...patch };
      const next = setByPath(prev, listPath, updated);
      persist(next);
      return next;
    });
  }, [persist]);

  return (
    <StoreContext.Provider value={{ content, synced, update, addItem, removeItem, updateItem, uploadImage }}>
      {children}
    </StoreContext.Provider>
  );
}

function useStore() {
  return React.useContext(StoreContext);
}

// Expose
Object.assign(window, { StoreProvider, useStore, uploadImage, DIARY_DEFAULTS, getSupabase, setByPath, getByPath });
