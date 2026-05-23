// RISO direction — bold zine, big hangul, two-color halftone overprint.

// Big hangul background letter (decorative)
const RisoGiantHan = ({ children, color = 'var(--red)', size = 520, top, left, right, bottom, rotate = 0, opacity = 1 }) => (
  <div style={{
    position: 'absolute', top, left, right, bottom,
    fontFamily: 'Black Han Sans, sans-serif',
    fontSize: size, color, lineHeight: .82, letterSpacing: '-0.05em',
    transform: `rotate(${rotate}deg)`, opacity,
    mixBlendMode: 'multiply', pointerEvents: 'none',
    whiteSpace: 'nowrap'
  }}>{children}</div>
);

// Riso photo placeholder — halftone tint
const RisoPhoto = ({ slot, color = 'var(--blue)', width = '100%', height = '100%', style }) => (
  <div style={{ position: 'relative', width, height, ...style }}>
    <div style={{
      position: 'absolute', inset: 0,
      background: 'repeating-linear-gradient(45deg, rgba(0,0,0,.06) 0 6px, rgba(0,0,0,.12) 6px 12px)',
    }}/>
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(currentColor 1.6px, transparent 1.8px)',
      backgroundSize: '5px 5px',
      color, mixBlendMode: 'multiply', opacity: .9
    }}/>
    <div style={{
      position: 'absolute', inset: 0, display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#efe7d6', color: 'var(--ink)', border: '1.5px solid var(--ink)',
        padding: '4px 10px', fontFamily: 'Space Mono, monospace',
        fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase'
      }}>{slot}</div>
    </div>
  </div>
);

// ─── 01. Cover ────────────────────────────────────────────────
function RisoCover() {
  return (
    <div className="riso" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* gigantic hangul behind everything */}
      <RisoGiantHan top={-90} left={-30} color="var(--red)" size={620} opacity={.14}>셋</RisoGiantHan>

      {/* registration marks corners */}
      {['tl','tr','bl','br'].map(c => (
        <div key={c} style={{
          position: 'absolute',
          [c.includes('t') ? 'top' : 'bottom']: 16,
          [c.includes('l') ? 'left' : 'right']: 16,
          width: 18, height: 18,
          background: 'radial-gradient(circle, var(--ink) 30%, transparent 32%, transparent 45%, var(--ink) 47%, var(--ink) 55%, transparent 57%)'
        }}/>
      ))}

      {/* top bar */}
      <div style={{ position: 'absolute', top: 24, left: 56, right: 56,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
        <div className="riso-mono" style={{ fontSize: 11, letterSpacing: '.22em', color: 'var(--ink)' }}>
          ISSUE 01 · MELBOURNE · 2026
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <span className="riso-mono" style={{
            padding: '4px 8px', background: 'var(--ink)', color: 'var(--paper)',
            fontSize: 10, letterSpacing: '.14em'
          }}>RISO</span>
          <span className="riso-mono" style={{
            padding: '4px 8px', background: 'var(--paper)', border: '1.5px solid var(--ink)',
            fontSize: 10, letterSpacing: '.14em', color: 'var(--ink)'
          }}>2-COLOR</span>
        </div>
      </div>

      {/* MASTHEAD */}
      <div style={{ position: 'absolute', top: 80, left: 56, right: 56, zIndex: 4 }}>
        <div style={{
          fontFamily: 'Archivo Black, sans-serif',
          fontSize: 132, lineHeight: .9, color: 'var(--ink)', letterSpacing: '-0.045em',
        }}>
          <span style={{ color: 'var(--blue)', mixBlendMode: 'multiply' }}>THREE</span>{' '}
          <span style={{ color: 'var(--red)', mixBlendMode: 'multiply' }}>FRIENDS</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 32, marginTop: 4 }}>
          <div className="riso-han" style={{ fontSize: 96, color: 'var(--ink)', lineHeight: .9 }}>
            in 멜번
          </div>
          <div className="riso-body" style={{ fontSize: 16, color: 'var(--ink)', lineHeight: 1.25, maxWidth: 340, marginBottom: 14 }}>
            <strong style={{ fontFamily: 'Archivo Black' }}>A FIELD JOURNAL</strong><br/>
            정민, 규보 그리고 윌리엄. <br/>
            <span style={{ color: 'var(--red)' }}>five months · two passports · one share house.</span>
          </div>
        </div>
      </div>

      {/* big photo block */}
      <div className="riso-block" style={{
        position: 'absolute', top: 460, left: 56, width: 340, height: 280,
        background: 'var(--paper)', overflow: 'hidden'
      }}>
        <RisoPhoto slot="THE THREE OF US · MARCH" color="var(--blue)" />
      </div>

      {/* secondary photos */}
      <div className="riso-block" style={{
        position: 'absolute', top: 460, left: 416, width: 200, height: 180,
        background: 'var(--paper)', overflow: 'hidden'
      }}>
        <RisoPhoto slot="LYGON · GELATO" color="var(--red)" />
      </div>
      <div className="riso-block" style={{
        position: 'absolute', top: 650, left: 416, width: 200, height: 90,
        background: 'var(--yellow)', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 14px'
      }}>
        <div className="riso-han" style={{ fontSize: 34, color: 'var(--ink)', lineHeight: .9, textAlign: 'center' }}>
          좋아하는<br/>곳들
        </div>
      </div>

      {/* TOC card on right */}
      <div className="riso-block" style={{
        position: 'absolute', top: 460, right: 56, width: 440, padding: 22,
        background: 'var(--paper)'
      }}>
        <div className="riso-mono" style={{ fontSize: 10, letterSpacing: '.2em', color: 'var(--red)' }}>
          ── INSIDE / 차례 ──
        </div>
        <ol style={{
          listStyle: 'none', padding: 0, margin: '12px 0 0',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 22px'
        }}>
          {[
            ['01', 'PHOTOS', '사진'],
            ['02', 'FOOD', '음식'],
            ['03', 'MAP', '지도'],
            ['04', 'TIMELINE', '시간'],
            ['05', 'PLAYLIST', '노래'],
            ['06', 'JOKES', '농담'],
            ['07', 'LETTERS', '편지'],
            ['08', 'GUESTBOOK', '방명록'],
          ].map(([n,en,kr]) => (
            <li key={n} style={{ display: 'flex', alignItems: 'baseline', gap: 8,
                                 borderBottom: '1.5px solid var(--ink)', padding: '6px 0' }}>
              <span className="riso-mono" style={{ fontSize: 11, color: 'var(--red)', minWidth: 18 }}>{n}</span>
              <span style={{ fontFamily: 'Archivo Black', fontSize: 16 }}>{en}</span>
              <span style={{ flex: 1 }} />
              <span className="riso-han" style={{ fontSize: 18, color: 'var(--blue)' }}>{kr}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* PLAY bar — fixed at bottom right of cover */}
      <div style={{
        position: 'absolute', bottom: 28, right: 56, zIndex: 6, display: 'flex',
        alignItems: 'center', gap: 0
      }}>
        <button style={{
          background: 'var(--red)', color: 'var(--paper)', border: '2px solid var(--ink)',
          fontFamily: 'Archivo Black', fontSize: 14, letterSpacing: '.1em',
          padding: '12px 18px', boxShadow: '4px 4px 0 var(--ink)', cursor: 'pointer'
        }}>▶ PLAY MIXTAPE</button>
        <div style={{
          background: 'var(--paper)', border: '2px solid var(--ink)', borderLeft: 'none',
          fontFamily: 'Space Mono, monospace', fontSize: 11, padding: '12px 14px',
          boxShadow: '4px 4px 0 var(--ink)'
        }}>32 TRACKS</div>
      </div>

      {/* DATELINE bottom-left */}
      <div style={{ position: 'absolute', bottom: 28, left: 56, zIndex: 6 }}>
        <div className="riso-mono" style={{ fontSize: 10, color: 'var(--ink)', letterSpacing: '.18em' }}>
          FROM FITZROY TO GLEN WAVERLEY ·  −37.8136 · 144.9631
        </div>
      </div>
    </div>
  );
}

// ─── 02. Photos ───────────────────────────────────────────────
function RisoPhotos() {
  const cells = [
    { slot: 'BRUNSWICK · MARCH',     tint: 'var(--blue)', cap: '규보 vs the wind' },
    { slot: 'LUNE · 7AM',            tint: 'var(--red)',  cap: 'queue victory' },
    { slot: 'PELLEGRINI’S',          tint: 'var(--blue)', cap: 'first granita' },
    { slot: 'NGV · ROTHKO',          tint: 'var(--red)',  cap: 'said nothing for 12 min' },
    { slot: 'CARLTON · PICNIC',      tint: 'var(--blue)', cap: 'magpies attacked' },
    { slot: 'TRAM 96 · 23:11',       tint: 'var(--red)',  cap: 'last tram chronicles' },
    { slot: 'GLEN WAVERLEY · KBBQ',  tint: 'var(--blue)', cap: 'belt off, 정민 mode' },
    { slot: 'BOX HILL · 빙수',        tint: 'var(--red)',  cap: 'brain freeze' },
    { slot: 'ST KILDA PIER · 6PM',   tint: 'var(--blue)', cap: 'one (1) penguin' },
    { slot: 'BRIGHTON BOXES',        tint: 'var(--red)',  cap: 'colour study' },
    { slot: 'SHARE HOUSE · KITCHEN', tint: 'var(--blue)', cap: '김치 day' },
    { slot: 'CBD · 11PM RAIN',       tint: 'var(--red)',  cap: 'umbrella, broken' },
  ];

  return (
    <div className="riso" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <RisoGiantHan top={-30} right={-30} color="var(--blue)" size={420} opacity={.18} rotate={0}>사진</RisoGiantHan>

      {/* header */}
      <div style={{ position: 'absolute', top: 28, left: 56, right: 56, zIndex: 3,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="riso-mono" style={{ fontSize: 11, letterSpacing: '.22em', color: 'var(--red)' }}>
            02 · PHOTOS · 사진
          </div>
          <div className="riso-han" style={{ fontSize: 78, lineHeight: .9, color: 'var(--ink)' }}>
            우리가 찍은 <span style={{ color: 'var(--red)' }}>72장</span>
          </div>
          <div style={{ fontFamily: 'Archivo Black', fontSize: 22, color: 'var(--ink)' }}>
            <span style={{ color: 'var(--blue)' }}>SEVENTY-TWO</span> PHOTOS WE TOOK
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['ALL', '규보', '정민', 'WILL', 'FOOD'].map((t, i) => (
            <span key={t} className="riso-mono" style={{
              padding: '6px 10px', fontSize: 10, letterSpacing: '.14em',
              border: '1.5px solid var(--ink)',
              background: i === 0 ? 'var(--ink)' : 'var(--paper)',
              color: i === 0 ? 'var(--paper)' : 'var(--ink)',
              boxShadow: i === 0 ? '3px 3px 0 var(--red)' : 'none',
              cursor: 'pointer'
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* contact-sheet grid */}
      <div style={{ position: 'absolute', top: 220, left: 56, right: 56, bottom: 60,
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(3, 1fr)',
                    gap: 14 }}>
        {cells.map((c, i) => (
          <div key={i} className="lift riso-block" style={{ position: 'relative', background: 'var(--paper)', overflow: 'hidden' }}>
            <RisoPhoto slot={c.slot} color={c.tint} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              background: 'var(--ink)', color: 'var(--paper)',
              fontFamily: 'Space Mono, monospace', fontSize: 10,
              padding: '4px 8px', display: 'flex', justifyContent: 'space-between'
            }}>
              <span>#{String(i+1).padStart(2,'0')}</span>
              <span style={{ fontFamily: 'Archivo Black', fontSize: 11 }}>{c.cap}</span>
            </div>
          </div>
        ))}
      </div>

      {/* footer instruction */}
      <div style={{ position: 'absolute', bottom: 22, left: 56, right: 56, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
        <div className="riso-mono" style={{ fontSize: 10, letterSpacing: '.18em' }}>
          DRAG ANY IMAGE FILE ONTO A CELL · DROP TO REPLACE
        </div>
        <div className="riso-mono" style={{ fontSize: 10, letterSpacing: '.18em', color: 'var(--red)' }}>
          PAGE 02 / 08
        </div>
      </div>
    </div>
  );
}

// ─── 03. Food ─────────────────────────────────────────────────
function RisoFood() {
  const dishes = [
    { name: 'TTEOKBOKKI',  kr: '떡볶이',   place: 'HOME · BY JEONGMIN',   r: 5, n: 'spice level: william cried',  c: 'var(--red)' },
    { name: 'CRUFFIN',     kr: '크러핀',   place: 'LUNE · FITZROY',       r: 5, n: '40 min queue. worth it.',     c: 'var(--blue)' },
    { name: 'KIMCHI JJIGAE', kr: '김치찌개', place: 'MUKJA · CBD',         r: 4, n: 'mum’s is still better — 규보', c: 'var(--red)' },
    { name: 'FLAT WHITE',  kr: '플랫화이트', place: 'PATRICIA · BOURKE',   r: 5, n: '“이게 호주맛이구나”',           c: 'var(--blue)' },
    { name: 'BANH MI',     kr: '반미',     place: 'NHU LAN · RICHMOND',   r: 4, n: 'too much chilli (again)',     c: 'var(--red)' },
    { name: 'HOTTEOK',     kr: '호떡',     place: 'QVM NIGHT MARKET',     r: 5, n: 'winter only · gloves on',     c: 'var(--blue)' },
  ];

  return (
    <div className="riso" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <RisoGiantHan top={-70} left={-40} color="var(--red)" size={480} opacity={.13}>먹</RisoGiantHan>
      <RisoGiantHan bottom={-110} right={-30} color="var(--blue)" size={440} opacity={.13}>다</RisoGiantHan>

      <div style={{ position: 'absolute', top: 28, left: 56, right: 56, zIndex: 3,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div className="riso-mono" style={{ fontSize: 11, letterSpacing: '.22em', color: 'var(--red)' }}>
            03 · FOOD · 음식
          </div>
          <div style={{ fontFamily: 'Archivo Black, sans-serif', fontSize: 88, lineHeight: .9, color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            EAT, REPEAT.
          </div>
          <div className="riso-han" style={{ fontSize: 32, color: 'var(--blue)', lineHeight: 1, marginTop: 2 }}>
            먹고 또 먹다
          </div>
        </div>
        <div className="riso-block" style={{
          background: 'var(--yellow)', padding: '12px 16px',
          fontFamily: 'Space Mono, monospace', fontSize: 11, lineHeight: 1.6,
          maxWidth: 220
        }}>
          152 MEALS<br/>
          37 CAFÉS ☕<br/>
          11 한식당<br/>
          ──────────<br/>
          <strong style={{ fontFamily: 'Archivo Black', fontSize: 14 }}>TOTAL: 행복</strong>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 250, left: 56, right: 56, bottom: 70,
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 18 }}>
        {dishes.map((d, i) => (
          <div key={d.name} className="riso-block lift" style={{
            background: 'var(--paper)', display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ height: 130, position: 'relative', borderBottom: '2px solid var(--ink)' }}>
              <RisoPhoto slot={d.kr} color={d.c} />
            </div>
            <div style={{ padding: '12px 14px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontFamily: 'Archivo Black', fontSize: 20, color: 'var(--ink)', lineHeight: 1 }}>{d.name}</div>
                  <div className="riso-han" style={{ fontSize: 22, color: d.c, lineHeight: 1 }}>{d.kr}</div>
                </div>
                <div style={{ fontFamily: 'Archivo Black', fontSize: 14, color: 'var(--red)' }}>
                  {'★'.repeat(d.r)}<span style={{ color: 'rgba(0,0,0,.15)' }}>{'★'.repeat(5-d.r)}</span>
                </div>
              </div>
              <div className="riso-mono" style={{ fontSize: 10, color: 'rgba(0,0,0,.55)', marginTop: 8, letterSpacing: '.1em' }}>
                {d.place}
              </div>
              <div className="riso-body" style={{ fontSize: 13, color: 'var(--ink)', marginTop: 6, lineHeight: 1.25 }}>
                {d.n}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ position: 'absolute', bottom: 22, left: 56, right: 56, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
        <div className="riso-mono" style={{ fontSize: 10, letterSpacing: '.18em' }}>
          NEXT ↓ — THE MAP · 지도
        </div>
        <div className="riso-mono" style={{ fontSize: 10, letterSpacing: '.18em', color: 'var(--red)' }}>
          PAGE 03 / 08
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RisoCover, RisoPhotos, RisoFood });
