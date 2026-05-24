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
    polaroids: [
      { id: 'c1', slot: 'three of us · brunswick', caption: 'us three', captionKr: '우리 셋', imageUrl: null, top: 70, left: 880, width: 220, rot: -4, tape: 'blue', zIndex: 5 },
      { id: 'c2', slot: 'lygon st · gelato', caption: 'gelato run', captionKr: '', imageUrl: null, top: 250, left: 780, width: 170, rot: 5, tape: 'yellow', zIndex: 4 },
      { id: 'c3', slot: 'tram 96 · 11pm', caption: 'last tram home', captionKr: '마지막 트램', imageUrl: null, top: 340, left: 910, width: 150, rot: -7, tape: 'red', zIndex: 6 },
    ],
    notes: [
      { id: 'cn1', text: '"you bring vegemite,\ni bring 김치"\n— rule of the share house', top: 620, left: 420, width: 180, rot: -4, bg: '#fef4a8' },
    ],
  },
  scrapbookElements: [],
  pageHeaders: {
    '02': { en: 'the photo wall', kr: '사진', subKr: '드래그해서 옮겨봐', subEn: 'drag any photo, anywhere' },
    '04': { en: 'our melbourne map', kr: '지도', subKr: '', subEn: '' },
    '05': { en: 'months together', kr: '시간', subKr: '2월부터 6월까지', subEn: 'five months, from feb to june' },
    '06': { en: 'our mixtape', kr: '노래', subKr: '멜번에서 들은 32곡', subEn: 'thirty-two songs · side A' },
    '07': { en: 'inside jokes', kr: '농담', subKr: '우리만 아는 이야기', subEn: 'things only we get' },
    '08': { en: 'letters to keep', kr: '편지', subKr: '고이 접어 둘 편지 셋', subEn: 'three notes, before we said goodbye' },
    '09': { en: 'sign the book', kr: '방명록', subKr: '잠깐 들렀다 가는 사람도 환영해', subEn: 'anyone who scrolled this far, sign here' },
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
  foodHeader: {
    kicker: '03 · FOOD DIARY · 음식 일기',
    title: 'what we ate',
    aside: '(a lot)',
    receiptTitle: 'MELBOURNE FOOD CO.',
  },
  food: [
    { id: 'f1', name: 'tteokbokki', kr: '떡볶이', place: '@home · jeongmin cooked', rating: 5, note: 'extra spicy. william cried (a little)', imageUrl: null },
    { id: 'f2', name: 'lune cruffin', kr: '크러핀', place: 'lune · fitzroy', rating: 5, note: '40 min queue. worth it.', imageUrl: null },
    { id: 'f3', name: 'kimchi jjigae', kr: '김치찌개', place: 'mukja · cbd', rating: 4, note: '규보 said “mum’s is better”', imageUrl: null },
    { id: 'f4', name: 'flat white', kr: '플랫화이트', place: 'patricia · little bourke', rating: 5, note: 'jeongmin: “이게 호주맛이구나”', imageUrl: null },
    { id: 'f5', name: 'banh mi', kr: '반미', place: 'nhu lan · richmond', rating: 4, note: 'too much chilli. again.', imageUrl: null },
    { id: 'f6', name: 'hotteok', kr: '호떡', place: 'queen vic night mkt', rating: 5, note: 'winter only. wear gloves.', imageUrl: null },
  ],
  foodReceipt: '152 meals · together\n37 cafes\n11 한식당\n──────────────\nTOTAL: 행복',
  foodSignature: '“먹고, 또 먹고” — eat, then eat again',
  mapPins: [
    { id: 'm1', n: '01', name: 'Lune', kr: '룬', place: 'Fitzroy', x: 56, y: 32 },
    { id: 'm2', n: '02', name: 'Pellegrini’s', kr: '펠레그리니', place: 'Bourke St', x: 47, y: 50 },
    { id: 'm3', n: '03', name: 'Queen Vic', kr: '퀸빅', place: 'CBD', x: 38, y: 44 },
    { id: 'm4', n: '04', name: 'Carlton', kr: '칼튼', place: 'Carlton', x: 55, y: 36 },
    { id: 'm5', n: '05', name: 'NGV', kr: '미술관', place: 'Southbank', x: 45, y: 62 },
    { id: 'm6', n: '06', name: 'Mukja', kr: '먹자', place: 'CBD · 한식', x: 50, y: 52 },
    { id: 'm7', n: '07', name: 'Box Hill', kr: '빙수집', place: 'Box Hill', x: 85, y: 56 },
    { id: 'm8', n: '08', name: 'Glen Waverley', kr: 'K-BBQ', place: 'Glen Waverley', x: 82, y: 66 },
    { id: 'm9', n: '09', name: 'St Kilda', kr: '세인트킬다', place: 'St Kilda', x: 30, y: 88 },
    { id: 'm10', n: '10', name: 'Brighton', kr: '비치박스', place: 'Brighton', x: 26, y: 95 },
    { id: 'm11', n: '11', name: 'Share house', kr: '우리집', place: 'Brunswick', x: 62, y: 22 },
  ],
  mapNote: '“next time:\nbrighton at dawn,\nbefore the boxes glow”',
  timelineMonths: [
    { id: 't1', en: 'Feb', kr: '2월', big: 'we meet', note: '교포 lands at TUL · jeongmin’s already crashing my couch', pol: 'first dinner · 14 feb', bg: '#fdf3df', accent: '#d44a35', tape: 'red', imageUrl: null },
    { id: 't2', en: 'Mar', kr: '3월', big: 'autumn', note: 'lygon st gelato season ends · we eat it anyway', pol: 'lygon st · 03 mar', bg: '#f6e9d3', accent: '#213e6c', tape: 'blue', imageUrl: null },
    { id: 't3', en: 'Apr', kr: '4월', big: 'cold snap', note: 'first puffer jackets · 김치 weekend · ngv all afternoon', pol: 'share house · 17 apr', bg: '#f9ecd1', accent: '#6b7a4a', tape: 'yellow', imageUrl: null },
    { id: 't4', en: 'May', kr: '5월', big: 'routines', note: 'patricia every wednesday · jeongmin learns to make a flat white', pol: 'patricia · 08 may', bg: '#fae6cf', accent: '#d39836', tape: 'red', imageUrl: null },
    { id: 't5', en: 'Jun', kr: '6월', big: 'last weeks', note: 'box hill bingsu run · final trams · letters left on the fridge', pol: 'st kilda · 21 jun', bg: '#f3e0c1', accent: '#213e6c', tape: 'dots', imageUrl: null },
  ],
  timelineStamps: {
    arrived: 'ARRIVED · 14 FEB',
    departing: 'DEPARTING · 28 JUN',
  },
  timelineNote: '“152 days. not enough.”\n— 정민, on the tram home',
  playlist: [
    { id: 's1', n: '01', t: '밤편지', a: 'IU', who: 'JM', note: 'sleeping pill, but nice' },
    { id: 's2', n: '02', t: 'The Less I Know the Better', a: 'Tame Impala', who: 'W', note: 'lygon walk anthem' },
    { id: 's3', n: '03', t: '어떻게 이별까지 사랑하겠어', a: 'AKMU', who: 'GB', note: '규보 cried (a bit)' },
    { id: 's4', n: '04', t: 'Never Be Like You', a: 'Flume', who: 'W', note: 'sunday morning' },
    { id: 's5', n: '05', t: 'Tomboy', a: 'Hyukoh', who: 'JM', note: 'tram window song' },
    { id: 's6', n: '06', t: 'Cherry-coloured Funk', a: 'Cocteau Twins', who: 'GB', note: 'rothko room loop' },
    { id: 's7', n: '07', t: '봄날', a: 'BTS', who: 'JM', note: 'unironic. fight me.' },
    { id: 's8', n: '08', t: 'Eleanor Put Your Boots On', a: 'Franz Ferdinand', who: 'W', note: 'st kilda pier' },
    { id: 's9', n: '09', t: 'Beautiful', a: 'Crush', who: 'GB', note: 'kitchen cooking song' },
    { id: 's10', n: '10', t: 'Sometimes', a: 'James', who: 'W', note: 'cold brunswick' },
    { id: 's11', n: '11', t: '나의 사춘기에게', a: 'Bolbbalgan4', who: 'JM', note: 'walk-home-late song' },
    { id: 's12', n: '12', t: 'Innerbloom', a: 'RÜFÜS DU SOL', who: 'W', note: 'last side B track' },
  ],
  playlistCover: {
    title: 'melbourne',
    subtitle: '우리 셋의 32곡',
    note: '“press play.\nthen dance, even if you’re alone.”\n— 규보, on the share house fridge',
  },
  player: {
    currentTrackId: 's1',
    playing: false,
  },
  letters: [
    {
      id: 'l1', from: '정민', en: 'Jeongmin', to: 'W & 규보', bg: '#fef4d4', rot: -2.5, accent: '#d44a35',
      body: [
        'I didn’t think I’d miss the smell of tram brakes, but I will.',
        'Will — thanks for never finishing the kimchi without telling me.',
        '규보야 — the cruffin queue was a mistake. and also my favourite morning.',
        'I’m taking the magpies home in my head.',
      ],
      sign: '정민', date: '23 jun · share house kitchen',
    },
    {
      id: 'l2', from: '규보', en: 'Hailey · Gyubo', to: 'JM & Will', bg: '#fbd9c9', rot: 1.5, accent: '#213e6c',
      body: [
        '이런 친구들 만난 거, 운이 좋다는 말로는 부족해.',
        'Will, you cook pasta like an Italian grandfather and I will never recover.',
        '정민아, 너랑 빙수 먹은 날들이 제일 좋았어.',
        'Melbourne, 다음에 또 보자. 우리 셋 다 같이.',
      ],
      sign: '규보 · Hailey', date: '26 jun · the airport',
    },
    {
      id: 'l3', from: 'Will', en: 'William', to: 'JM & 규보', bg: '#dff0d6', rot: -1, accent: '#6b7a4a',
      body: [
        'Five months ago this share house was just a couch and a kettle.',
        'Now there’s gochujang on the top shelf where the salt used to be.',
        'I don’t think the kitchen will sound the same after Sunday.',
        'Come back. Bring 라면. The tram is still on me.',
      ],
      sign: 'Will', date: '27 jun · brunswick',
    },
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

function mergeDefaults(defaults, saved) {
  if (saved == null) return defaults;
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;
  if (typeof defaults !== 'object' || typeof saved !== 'object' || Array.isArray(saved)) return saved;

  const merged = { ...defaults };
  for (const key of Object.keys(saved)) {
    merged[key] = key in defaults ? mergeDefaults(defaults[key], saved[key]) : saved[key];
  }
  return merged;
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
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('Could not read image file.'));
    reader.onload = () => {
      if (!file.type?.startsWith('image/')) {
        resolve(reader.result);
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(reader.result);
      img.onload = () => {
        const maxSide = 1600;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file) {
  const sb = getSupabase();
  if (!sb) {
    // local fallback — encode as a compressed data URL
    return fileToDataUrl(file);
  }
  const cfg = window.DIARY_CONFIG;
  const bucket = cfg.PHOTOS_BUCKET || 'diary-photos';
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { data, error } = await sb.storage.from(bucket).upload(key, file);
  if (error) {
    const msg = `${error.message || error}`.toLowerCase();
    const canFallback =
      msg.includes('bucket') ||
      msg.includes('not found') ||
      msg.includes('row-level security') ||
      msg.includes('policy') ||
      msg.includes('permission') ||
      msg.includes('forbidden') ||
      msg.includes('unauthorized') ||
      ['401', '403', '404'].includes(String(error.statusCode || error.status || ''));

    if (canFallback) {
      console.warn(`Supabase Storage upload failed for bucket "${bucket}". Saving a compressed in-diary image instead.`, error);
      return fileToDataUrl(file);
    }
    throw error;
  }
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
        if (saved) setContent(mergeDefaults(DIARY_DEFAULTS, saved));
      } catch {}
      setSynced('local');
      return;
    }

    (async () => {
      const { data, error } = await sb.from('diary_state').select('content').eq('id', 1).maybeSingle();
      if (error) { console.error(error); setSynced('error'); return; }
      if (data?.content && Object.keys(data.content).length) {
        setContent(mergeDefaults(DIARY_DEFAULTS, data.content));
      } else {
        await sb.from('diary_state').upsert({ id: 1, content: DIARY_DEFAULTS });
      }
      setSynced('cloud');
    })();

    const chan = sb.channel('diary-state')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'diary_state' },
        (payload) => { if (payload.new?.content) setContent(mergeDefaults(DIARY_DEFAULTS, payload.new.content)); })
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
Object.assign(window, { StoreProvider, useStore, uploadImage, DIARY_DEFAULTS, getSupabase, setByPath, getByPath, mergeDefaults });
