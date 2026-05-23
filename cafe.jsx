// CAFE direction — editorial photo journal. Big serif, considered whitespace,
// gum-leaf sage + persimmon palette.

const CafeRule = ({ style }) => (
  <div style={{ height: 1, background: 'currentColor', opacity: .25, ...style }} />
);

const CafePhoto = ({ slot, ratio = '4 / 5', style }) => (
  <div className="photo-slot" data-slot={slot} style={{ aspectRatio: ratio, ...style }} />
);

const CafeFolio = ({ left, right, page }) => (
  <div style={{
    position: 'absolute', bottom: 30, left, right,
    display: 'flex', alignItems: 'center', gap: 12,
    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
    letterSpacing: '.22em', color: 'rgba(34,29,22,.6)',
    textTransform: 'uppercase'
  }}>
    <span>melbourne diary</span>
    <span style={{ width: 18, height: 1, background: 'currentColor', opacity: .5 }} />
    <span>{page}</span>
  </div>
);

// ─── 01. Cover ────────────────────────────────────────────────
function CafeCover() {
  return (
    <div className="cafe" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* subtle warm vignette */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px rgba(80,60,30,.08)', pointerEvents: 'none' }} />

      {/* TOP RULE */}
      <div style={{ position: 'absolute', top: 36, left: 64, right: 64,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <div className="cafe-mono" style={{ fontSize: 11, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Vol. 1 · 멜번 일기
        </div>
        <div className="cafe-mono" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>FEB → JUN  ·  MMXXVI</div>
        <div className="cafe-mono" style={{ fontSize: 11, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Three friends · 세 사람
        </div>
      </div>
      <CafeRule style={{ position: 'absolute', top: 64, left: 64, right: 64 }} />

      {/* MASTHEAD */}
      <div style={{ position: 'absolute', top: 96, left: 64, width: 560 }}>
        <div className="cafe-kr" style={{ fontSize: 24, color: 'var(--persimmon)', letterSpacing: '.04em' }}>
          멜번에서, 우리 셋
        </div>
        <h1 className="cafe-serif" style={{
          fontWeight: 300, fontSize: 82, lineHeight: .96, margin: '14px 0 0',
          letterSpacing: '-0.02em', color: 'var(--ink)'
        }}>
          A quiet <em style={{ color: 'var(--persimmon)', fontWeight: 500 }}>record</em><br/>
          of three<br/>
          <em style={{ fontWeight: 400 }}>friendships.</em>
        </h1>

        <div style={{ marginTop: 22, display: 'flex', gap: 22 }}>
          {[
            ['Jeongmin', '정민', 'Seoul'],
            ['Hailey · 규보', 'Gyubo', 'Auckland → Seoul'],
            ['William', '윌', 'Melbourne'],
          ].map(([en, kr, where]) => (
            <div key={en} style={{ flex: 1 }}>
              <div className="cafe-mono" style={{ fontSize: 9, letterSpacing: '.22em', color: 'rgba(34,29,22,.55)', textTransform: 'uppercase' }}>
                {where}
              </div>
              <div className="cafe-serif" style={{ fontSize: 22, lineHeight: 1.1, marginTop: 4 }}>{en}</div>
              <div className="cafe-kr" style={{ fontSize: 15, color: 'var(--sage)' }}>{kr}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HERO PHOTO — right column, tall */}
      <div style={{ position: 'absolute', top: 110, right: 64, width: 460, bottom: 110 }}>
        <CafePhoto slot="cover photograph · three of us" ratio="auto" style={{ width: '100%', height: '100%', aspectRatio: 'auto' }} />
        <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0,
                      padding: '14px 16px',
                      background: 'rgba(243,237,224,.92)', backdropFilter: 'blur(2px)' }}>
          <div className="cafe-mono" style={{ fontSize: 10, letterSpacing: '.18em', color: 'var(--persimmon)', textTransform: 'uppercase' }}>
            Plate · 01
          </div>
          <div className="cafe-serif" style={{ fontSize: 22, lineHeight: 1.15, fontStyle: 'italic', marginTop: 2 }}>
            “At the kitchen table, after kimchi day.”
          </div>
          <div className="cafe-kr" style={{ fontSize: 13, color: 'var(--moss)', marginTop: 4 }}>
            김치 담그던 날, 우리 부엌에서.
          </div>
        </div>
      </div>

      {/* CONTENTS — bottom-left */}
      <div style={{ position: 'absolute', bottom: 130, left: 64, right: 580 }}>
        <div className="cafe-mono" style={{ fontSize: 10, letterSpacing: '.22em', color: 'var(--persimmon)', textTransform: 'uppercase', marginBottom: 8 }}>
          ── Contents · 차례 ──
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0 24px' }}>
          {[
            ['I',    'Photographs',   '사진',   '008'],
            ['II',   'A Map',         '지도',   '022'],
            ['III',  'Food',          '음식',   '034'],
            ['IV',   'Months',        '시간',   '048'],
            ['V',    'A Playlist',    '노래',   '060'],
            ['VI',   'Inside jokes',  '농담',   '068'],
          ].map(([n, en, kr, p]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'baseline', gap: 8,
                                  padding: '6px 0', borderBottom: '0.5px solid rgba(34,29,22,.2)', whiteSpace: 'nowrap' }}>
              <span className="cafe-mono" style={{ fontSize: 10, color: 'var(--persimmon)', minWidth: 26 }}>{n}.</span>
              <span className="cafe-serif" style={{ fontSize: 17, lineHeight: 1 }}>{en}</span>
              <span className="cafe-kr" style={{ fontSize: 12, color: 'var(--sage)', marginLeft: 4 }}>{kr}</span>
              <span style={{ flex: 1 }} />
              <span className="cafe-mono" style={{ fontSize: 9, color: 'rgba(34,29,22,.55)' }}>p.{p}</span>
            </div>
          ))}
        </div>
        <div className="cafe-mono" style={{ fontSize: 9, color: 'rgba(34,29,22,.5)', marginTop: 8, letterSpacing: '.18em', textTransform: 'uppercase' }}>
          + Letters (vii · p.076)  ·  Guestbook (viii · p.088)
        </div>
      </div>

      {/* small gum leaf flourish */}
      <div style={{ position: 'absolute', top: 84, right: 540, transform: 'rotate(-18deg)' }}>
        <Icons.GumLeaf size={36} color="var(--sage)" />
      </div>

      {/* AUDIO TOGGLE — minimal */}
      <div style={{
        position: 'absolute', bottom: 70, right: 64, width: 220,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 14px',
        border: '1px solid var(--ink)', background: 'rgba(243,237,224,.85)'
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)',
          color: 'var(--paper)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10
        }}>▶</div>
        <div style={{ lineHeight: 1.1 }}>
          <div className="cafe-mono" style={{ fontSize: 9, letterSpacing: '.18em', color: 'rgba(34,29,22,.6)', textTransform: 'uppercase' }}>
            A Playlist
          </div>
          <div className="cafe-serif" style={{ fontSize: 17, fontStyle: 'italic' }}>thirty-two songs</div>
        </div>
      </div>

      {/* bottom rule + folio */}
      <CafeRule style={{ position: 'absolute', bottom: 50, left: 64, right: 64 }} />
      <CafeFolio left={64} page="cover · 표지" />
      <div style={{ position: 'absolute', bottom: 30, right: 64,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    letterSpacing: '.22em', color: 'rgba(34,29,22,.6)', textTransform: 'uppercase' }}>
        edition of three
      </div>
    </div>
  );
}

// ─── 02. Photographs ──────────────────────────────────────────
function CafePhotos() {
  return (
    <div className="cafe" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* header */}
      <div style={{ position: 'absolute', top: 36, left: 64, right: 64,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20 }}>
        <div className="cafe-mono" style={{ fontSize: 10, letterSpacing: '.22em', color: 'var(--persimmon)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          I · Photographs · 사진
        </div>
        <div className="cafe-mono" style={{ fontSize: 10, letterSpacing: '.22em', color: 'rgba(34,29,22,.5)', whiteSpace: 'nowrap' }}>
          PLATES 1 — 24  ·  PRINTED ON KOZO
        </div>
      </div>
      <CafeRule style={{ position: 'absolute', top: 60, left: 64, right: 64 }} />

      {/* big title + lede (left) */}
      <div style={{ position: 'absolute', top: 92, left: 64, width: 360 }}>
        <h2 className="cafe-serif" style={{
          fontWeight: 300, fontSize: 78, lineHeight: .95, margin: 0, letterSpacing: '-0.015em'
        }}>
          The <em style={{ color: 'var(--persimmon)' }}>year</em><br/>in <em>light</em>.
        </h2>
        <div className="cafe-kr" style={{ fontSize: 22, color: 'var(--moss)', marginTop: 8 }}>
          빛으로 남긴 한 해
        </div>
        <p className="cafe-sans" style={{
          fontSize: 13, lineHeight: 1.6, marginTop: 22, color: 'rgba(34,29,22,.8)', maxWidth: 320,
          textWrap: 'pretty'
        }}>
          A loose contact sheet from five months on Lygon, Brunswick,
          Glen Waverley, and one cold afternoon at St Kilda Pier. Pulled from
          three phones and one half-broken film camera.
        </p>
        <div style={{ display: 'flex', gap: 6, marginTop: 18, flexWrap: 'wrap' }}>
          {['all', 'Jeongmin', '규보', 'William', 'food', 'streets', 'after dark'].map((t, i) => (
            <span key={t} className="cafe-mono" style={{
              padding: '5px 10px', fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase',
              border: '1px solid var(--ink)',
              background: i === 0 ? 'var(--ink)' : 'transparent',
              color: i === 0 ? 'var(--paper)' : 'var(--ink)',
              cursor: 'pointer'
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Plate grid — refined */}
      <div style={{ position: 'absolute', top: 92, right: 64, width: 720, bottom: 70,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    gap: 18 }}>
        {[
          { slot: 'lune · queue · 7am', ratio: '4/5', n: '02' },
          { slot: 'tram 96 · 23:11',    ratio: '4/5', n: '03' },
          { slot: 'naked for satan',    ratio: '4/5', n: '04' },
          { slot: 'qvm · saturday',     ratio: '4/5', n: '05' },
          { slot: 'jeongmin · cooking', ratio: '4/5', n: '06' },
          { slot: 'rothko room · ngv',  ratio: '4/5', n: '07' },
          { slot: 'st kilda pier',      ratio: '4/5', n: '08' },
          { slot: 'glen waverley · kbbq', ratio: '4/5', n: '09' },
          { slot: 'brighton · march',   ratio: '4/5', n: '10' },
        ].map((p, i) => (
          <div key={i} className="lift" style={{ position: 'relative' }}>
            <CafePhoto slot={p.slot} style={{ width: '100%', height: '100%', aspectRatio: 'auto' }} />
            <div className="cafe-mono" style={{
              position: 'absolute', top: 8, left: 8,
              fontSize: 9, padding: '2px 6px', background: 'rgba(243,237,224,.85)',
              letterSpacing: '.16em'
            }}>PL. {p.n}</div>
          </div>
        ))}
      </div>

      <CafeRule style={{ position: 'absolute', bottom: 50, left: 64, right: 64 }} />
      <CafeFolio left={64} page="i  ·  008" />
      <div style={{ position: 'absolute', bottom: 30, right: 64,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    letterSpacing: '.22em', color: 'rgba(34,29,22,.6)', textTransform: 'uppercase' }}>
        photographs / 사진
      </div>
    </div>
  );
}

// ─── 03. Food ─────────────────────────────────────────────────
function CafeFood() {
  const entries = [
    { en: 'Tteokbokki',     kr: '떡볶이',     place: 'Home, by Jeongmin',  date: '03 · 14', note: 'Made with the gochujang Hailey carried from Seoul.', },
    { en: 'Cruffin',         kr: '크러핀',     place: 'Lune · Fitzroy',     date: '03 · 22', note: 'Forty minutes in line. Spoke very little.' },
    { en: 'Kimchi jjigae',  kr: '김치찌개',   place: 'Mukja · CBD',        date: '04 · 02', note: '“Mum’s is better.” — 규보, on the verge.' },
    { en: 'Flat white',     kr: '플랫화이트', place: 'Patricia · Bourke',  date: '04 · 09', note: 'Jeongmin\u2019s first real one.' },
  ];

  return (
    <div className="cafe" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 36, left: 64, right: 64,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 20 }}>
        <div className="cafe-mono" style={{ fontSize: 10, letterSpacing: '.22em', color: 'var(--persimmon)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          III · Food · 음식
        </div>
        <div className="cafe-mono" style={{ fontSize: 10, letterSpacing: '.22em', color: 'rgba(34,29,22,.5)', whiteSpace: 'nowrap' }}>
          ENTRIES 01 — 32  ·  AN ONGOING LIST
        </div>
      </div>
      <CafeRule style={{ position: 'absolute', top: 60, left: 64, right: 64 }} />

      {/* title + intro */}
      <div style={{ position: 'absolute', top: 96, left: 64, right: 64,
                    display: 'flex', alignItems: 'flex-end', gap: 40 }}>
        <h2 className="cafe-serif" style={{
          fontWeight: 300, fontSize: 74, lineHeight: .98, margin: 0, letterSpacing: '-0.02em', flex: 1
        }}>
          Things we <em style={{ color: 'var(--persimmon)' }}>cooked, queued for, and missed</em>.
        </h2>
        <div style={{ width: 220 }}>
          <div className="cafe-kr" style={{ fontSize: 20, color: 'var(--moss)' }}>먹다, 또 먹다.</div>
          <div className="cafe-sans" style={{ fontSize: 12, color: 'rgba(34,29,22,.65)', marginTop: 6, lineHeight: 1.5 }}>
            One hundred and fifty-two meals between us. The good ones are written down.
          </div>
        </div>
      </div>

      {/* Entries — editorial list with adjacent plate */}
      <div style={{ position: 'absolute', top: 300, left: 64, right: 64, bottom: 70,
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '28px 40px' }}>
        {entries.map((e, i) => (
          <div key={e.en} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 130px' }}>
              <CafePhoto slot={e.kr} ratio="4/5" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="cafe-mono" style={{ fontSize: 9, letterSpacing: '.2em', color: 'rgba(34,29,22,.55)', textTransform: 'uppercase' }}>
                {String(i+1).padStart(2,'0')}  ·  {e.date}
              </div>
              <div className="cafe-serif" style={{ fontSize: 32, lineHeight: 1, fontWeight: 400, marginTop: 4 }}>
                {e.en}
              </div>
              <div className="cafe-kr" style={{ fontSize: 18, color: 'var(--persimmon)', marginTop: 2 }}>
                {e.kr}
              </div>
              <CafeRule style={{ margin: '10px 0' }} />
              <div className="cafe-mono" style={{ fontSize: 10, letterSpacing: '.14em', color: 'var(--moss)', textTransform: 'uppercase' }}>
                {e.place}
              </div>
              <div className="cafe-serif" style={{ fontSize: 16, fontStyle: 'italic', marginTop: 6, lineHeight: 1.35, color: 'rgba(34,29,22,.85)', textWrap: 'pretty' }}>
                {e.note}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CafeRule style={{ position: 'absolute', bottom: 50, left: 64, right: 64 }} />
      <CafeFolio left={64} page="iii  ·  034" />
      <div style={{ position: 'absolute', bottom: 30, right: 64,
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    letterSpacing: '.22em', color: 'rgba(34,29,22,.6)', textTransform: 'uppercase' }}>
        food / 음식
      </div>
    </div>
  );
}

Object.assign(window, { CafeCover, CafePhotos, CafeFood });
