// Additional scrapbook sections for the full diary site.
// Map · Timeline · Playlist · Jokes · Letters · Guestbook + DraggablePhotos.

// ─── Drag hook (accounts for parent --page-scale) ───────────────
// Tracks live position during drag and commits via `onCommit` on
// pointer-up. Used by photo-wall polaroids.
function useDraggable(initial = { x: 0, y: 0 }, onCommit) {
  const [pos, setPos] = React.useState(initial);
  const drag = React.useRef(null);

  // keep local pos in sync if store value changes (e.g. another user moved it)
  React.useEffect(() => {
    if (!drag.current) setPos(initial);
  }, [initial.x, initial.y]);

  const getScale = () => parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--page-scale')
  ) || 1;

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    drag.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, scale: getScale() };
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.classList.add('dragging');
    e.stopPropagation();
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    const d = drag.current;
    setPos({ x: d.ox + (e.clientX - d.sx) / d.scale, y: d.oy + (e.clientY - d.sy) / d.scale });
  };
  const onPointerUp = (e) => {
    if (!drag.current) return;
    const finalPos = { ...pos };
    drag.current = null;
    e.currentTarget.classList.remove('dragging');
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    onCommit?.(finalPos);
  };

  return { pos, dragHandlers: { onPointerDown, onPointerMove, onPointerUp } };
}

// Polaroid that can be dragged + has editable caption + droppable image.
function DraggablePolaroid({ photo, onCommit, onPatch, onDelete, zIndex = 2 }) {
  const { pos, dragHandlers } = useDraggable({ x: photo.x || 0, y: photo.y || 0 }, onCommit);
  const editing = window.useEditMode?.().editMode && window.useAuth?.().user;
  return (
    <div className="polaroid draggable" {...dragHandlers}
      style={{
        position: 'absolute', width: photo.width || 180,
        top: photo.top, left: photo.left, zIndex,
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${photo.rot || 0}deg)`,
      }}>
      <div className={`washi ${photo.tape === 'red' ? '' : photo.tape}`}
        style={{ top: -8, left: '50%', width: 60, marginLeft: -30, height: 14, opacity: .8 }} />
      <EditableImage
        src={photo.imageUrl}
        slot={photo.slot}
        className="photo-slot-wrap"
        style={{ aspectRatio: '1/1', position: 'relative' }}
        onChange={(url) => onPatch?.({ imageUrl: url })}
      />
      <div style={{ marginTop: 6, textAlign: 'center', lineHeight: 1.1 }}>
        <EditableText
          tag="div"
          className="sb-hand"
          style={{ fontSize: 18, color: '#1c1612' }}
          value={photo.caption}
          placeholder="caption"
          onChange={(v) => onPatch?.({ caption: v })}
        />
        <EditableText
          tag="div"
          className="sb-hand-kr"
          style={{ fontSize: 13, color: '#544a3a' }}
          value={photo.captionKr}
          placeholder="한글 캡션"
          onChange={(v) => onPatch?.({ captionKr: v })}
        />
      </div>
      {editing && (
        <DeleteButton onClick={onDelete}
          style={{ position: 'absolute', top: -10, right: -10, zIndex: 6 }} />
      )}
    </div>
  );
}

// Shared page header — keeps the rhythm across sections.
function SBPageHeader({ no, en, kr, subEn, subKr, accent = '#d44a35' }) {
  return (
    <div style={{ position: 'absolute', top: 36, left: 80, right: 80, zIndex: 4,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="sb-mono" style={{ fontSize: 11, color: '#7a6648', letterSpacing: '.22em', whiteSpace: 'nowrap' }}>
          {no} · {en.toUpperCase()} · {kr}
        </div>
        <h2 className="sb-hand" style={{ fontSize: 56, margin: '2px 0 0', lineHeight: .9, color: '#1c1612' }}>
          {en} <span style={{ color: accent }}>↓</span>
        </h2>
        {(subKr || subEn) && (
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
            {subKr && <span className="sb-hand-kr" style={{ fontSize: 18, color: '#213e6c' }}>{subKr}</span>}
            {subEn && <span className="sb-hand" style={{ fontSize: 18, color: '#1c1612' }}>· {subEn}</span>}
          </div>
        )}
      </div>
      <div className="sb-mono" style={{
        padding: '6px 10px', border: '1.5px solid #1c1612',
        fontSize: 10, letterSpacing: '.18em', background: 'rgba(255,255,255,.5)',
        marginTop: 6, whiteSpace: 'nowrap', flex: '0 0 auto'
      }}>PAGE {no} / 09</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 02 · DRAGGABLE PHOTO WALL
// ═══════════════════════════════════════════════════════════════
function DraggablePhotos() {
  const store = window.useStore?.();
  const photos = store?.content?.photos || window.DIARY_DEFAULTS?.photos || [];
  const patch = (id, p) => store?.updateItem?.('photos', id, p);
  const del   = (id) => store?.removeItem?.('photos', id);
  const add = () => {
    store?.addItem?.('photos', {
      id: 'p' + Date.now(),
      slot: 'new memory',
      caption: 'caption me',
      captionKr: '',
      rot: (Math.random() * 8) - 4,
      tape: ['red','blue','yellow','dots'][photos.length % 4],
      top: 280 + Math.random() * 180,
      left: 120 + Math.random() * 980,
      width: 180, imageUrl: null, x: 0, y: 0,
    });
  };

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <SBPageHeader no="02" en="the photo wall" kr="사진" subKr="드래그해서 옮겨봐" subEn="drag any photo, anywhere" />

      {photos.map((p, i) => (
        <DraggablePolaroid key={p.id} photo={p} zIndex={2 + (i % 4)}
          onCommit={(pos) => patch(p.id, pos)}
          onPatch={(prop) => patch(p.id, prop)}
          onDelete={() => del(p.id)} />
      ))}

      <div style={{ position: 'absolute', top: 320, left: 280, zIndex: 8, transform: 'rotate(-12deg)' }}>
        <div className="sb-sticker-circle" style={{ width: 56, height: 56, background: '#213e6c',
          fontSize: 14, padding: 6, textAlign: 'center', lineHeight: 1 }}>좋은<br/>날</div>
      </div>
      <div style={{ position: 'absolute', top: 600, left: 740, zIndex: 8, transform: 'rotate(8deg)' }}>
        <Icons.Pouch size={40} color="#d44a35" />
      </div>

      <SBPostit top={690} left={120} rotate={-5} width={170} bg="#fef4a8">
        “take more photos<br/>of jeongmin laughing!”
      </SBPostit>
      <SBPostit top={700} left={1060} rotate={4} width={160} bg="#fbd9c9">
        film roll #3<br/><span style={{ fontSize: 14, color: '#7a4a2a' }}>still at the lab</span>
      </SBPostit>

      <div style={{ position: 'absolute', bottom: 28, left: 80, right: 80, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
        <div className="sb-mono" style={{ fontSize: 10, color: '#7a6648', letterSpacing: '.2em' }}>
          {photos.length} POLAROIDS · DROP IMAGES TO REPLACE · 사진을 드래그하세요
        </div>
        {window.AddButton && <window.AddButton onClick={add} label="+ ADD POLAROID" />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 04 · MELBOURNE MAP
// ═══════════════════════════════════════════════════════════════
function ScrapbookMap() {
  const pins = [
    { n: '01', name: 'Lune',           kr: '룬',         place: 'Fitzroy',       x: 56, y: 32 },
    { n: '02', name: 'Pellegrini\u2019s', kr: '펠레그리니', place: 'Bourke St',     x: 47, y: 50 },
    { n: '03', name: 'Queen Vic',      kr: '퀸빅',       place: 'CBD',           x: 38, y: 44 },
    { n: '04', name: 'Carlton',        kr: '칼튼',       place: 'Carlton',       x: 55, y: 36 },
    { n: '05', name: 'NGV',            kr: '미술관',     place: 'Southbank',     x: 45, y: 62 },
    { n: '06', name: 'Mukja',          kr: '먹자',       place: 'CBD · 한식',    x: 50, y: 52 },
    { n: '07', name: 'Box Hill',       kr: '빙수집',     place: 'Box Hill',      x: 85, y: 56 },
    { n: '08', name: 'Glen Waverley',  kr: 'K-BBQ',     place: 'Glen Waverley', x: 82, y: 66 },
    { n: '09', name: 'St Kilda',       kr: '세인트킬다', place: 'St Kilda',      x: 30, y: 88 },
    { n: '10', name: 'Brighton',       kr: '비치박스',   place: 'Brighton',      x: 26, y: 95 },
    { n: '11', name: 'Share house',    kr: '우리집',     place: 'Brunswick',     x: 62, y: 22 },
  ];
  const [hovered, setHovered] = React.useState(null);

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <SBPageHeader no="04" en="our melbourne map" kr="지도" />

      {/* Map block */}
      <div style={{
        position: 'absolute', top: 170, left: 80, width: 760, height: 660,
        background: '#f5ead0',
        boxShadow: '0 8px 22px rgba(80,50,15,.18), inset 0 0 0 1px rgba(0,0,0,.06)',
        overflow: 'hidden'
      }}>
        {/* Washi at corners */}
        <div className="washi" style={{ top: -8, left: 60, width: 110, height: 16, transform: 'rotate(-3deg)' }} />
        <div className="washi blue" style={{ top: -8, right: 60, width: 90, height: 16, transform: 'rotate(4deg)' }} />

        {/* simple street grid */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .55 }}>
          {/* Yarra River */}
          <path d="M 0 70 C 20 64, 30 78, 45 70 C 60 62, 70 78, 100 72"
            stroke="#5a86c4" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Major streets (horizontal) */}
          {[28, 38, 48, 58].map(y => (
            <line key={'h'+y} x1="20" y1={y} x2="80" y2={y} stroke="#7a6648" strokeWidth=".35" strokeDasharray=".4 .6" />
          ))}
          {/* Major streets (vertical) */}
          {[34, 42, 50, 58].map(x => (
            <line key={'v'+x} x1={x} y1="22" x2={x} y2="62" stroke="#7a6648" strokeWidth=".35" strokeDasharray=".4 .6" />
          ))}
          {/* Tram line 96 */}
          <path d="M 30 88 L 38 78 L 48 60 L 56 32 L 64 20"
            stroke="#d44a35" strokeWidth=".8" fill="none" strokeDasharray="1 1" />
          {/* coastline */}
          <path d="M 0 100 L 20 99 L 30 95 L 40 92 L 100 92 L 100 100 Z"
            fill="rgba(90,134,196,.18)" />
        </svg>

        {/* Hand-written street labels */}
        <div className="sb-hand" style={{ position: 'absolute', left: '30%', top: '67%', fontSize: 18, color: '#5a86c4', fontStyle: 'italic', transform: 'rotate(-4deg)' }}>yarra ~</div>
        <div className="sb-hand" style={{ position: 'absolute', left: '50%', top: '24%', fontSize: 13, color: '#7a6648', transform: 'rotate(-90deg)' }}>swanston st</div>
        <div className="sb-hand" style={{ position: 'absolute', left: '20%', top: '49%', fontSize: 13, color: '#7a6648' }}>bourke st</div>
        <div className="sb-hand" style={{ position: 'absolute', left: '20%', top: '57%', fontSize: 13, color: '#7a6648' }}>collins st</div>
        <div className="sb-hand" style={{ position: 'absolute', right: 14, top: '90%', fontSize: 12, color: '#5a86c4', fontStyle: 'italic' }}>port phillip bay</div>
        <div className="sb-hand" style={{ position: 'absolute', left: '57%', top: '17%', fontSize: 13, color: '#d44a35', transform: 'rotate(-32deg)' }}>tram 96 →</div>

        {/* north arrow */}
        <div style={{ position: 'absolute', top: 16, left: 14, textAlign: 'center' }}>
          <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
                        borderBottom: '14px solid #1c1612', margin: '0 auto' }} />
          <div className="sb-mono" style={{ fontSize: 9, marginTop: 2, letterSpacing: '.2em' }}>N</div>
        </div>

        {/* pins */}
        {pins.map(p => (
          <div key={p.n} className="map-pin"
            onMouseEnter={() => setHovered(p.n)}
            onMouseLeave={() => setHovered(null)}
            style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: hovered === p.n ? 10 : 4 }}>
            <Icons.Pin size={30} color={hovered === p.n ? '#d44a35' : '#213e6c'} />
            <div className="pin-num">{p.n}</div>
            {hovered === p.n && (
              <div style={{
                position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
                background: '#fbf6e9', padding: '6px 10px', whiteSpace: 'nowrap',
                boxShadow: '0 4px 10px rgba(0,0,0,.18)', border: '1px solid #1c1612',
              }}>
                <div className="sb-hand" style={{ fontSize: 16, color: '#1c1612', lineHeight: 1 }}>{p.name}</div>
                <div className="sb-hand-kr" style={{ fontSize: 12, color: '#213e6c' }}>{p.kr}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Legend on right */}
      <div style={{ position: 'absolute', top: 170, right: 80, width: 320, bottom: 60 }}>
        <div className="sb-mono" style={{ fontSize: 10, color: '#7a6648', letterSpacing: '.2em' }}>
          OUR PLACES · 우리들의 장소
        </div>
        <h3 className="sb-hand" style={{ fontSize: 32, margin: '4px 0 12px', lineHeight: 1 }}>
          {pins.length} pins · <span style={{ color: '#d44a35' }}>5 months</span>
        </h3>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 480, overflow: 'hidden' }}>
          {pins.map(p => (
            <li key={p.n}
              onMouseEnter={() => setHovered(p.n)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'grid', gridTemplateColumns: '24px 1fr auto', alignItems: 'baseline', gap: 8,
                padding: '5px 4px', borderBottom: '0.5px dotted rgba(0,0,0,.25)',
                background: hovered === p.n ? 'rgba(212,74,53,.08)' : 'transparent',
                cursor: 'pointer'
              }}>
              <span className="sb-mono" style={{ fontSize: 11, color: '#d44a35' }}>{p.n}</span>
              <span className="sb-hand" style={{ fontSize: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
              <span className="sb-hand-kr" style={{ fontSize: 13, color: '#213e6c', whiteSpace: 'nowrap' }}>{p.kr}</span>
            </li>
          ))}
        </ol>

        <SBPostit top={null} left={null} rotate={3} width={200} bg="#fef4a8"
          style={{ position: 'absolute', bottom: 0, right: 0 }}>
          “next time:<br/>brighton at dawn,<br/>before the boxes glow”
        </SBPostit>
      </div>
    </div>
  );
}

window.DraggablePhotos = DraggablePhotos;
window.ScrapbookMap = ScrapbookMap;

// ═══════════════════════════════════════════════════════════════
// 05 · TIMELINE — Feb → Jun
// ═══════════════════════════════════════════════════════════════
function ScrapbookTimeline() {
  const months = [
    { en: 'Feb', kr: '2월', big: 'we meet',     note: '교포 lands at TUL · jeongmin\u2019s already crashing my couch', pol: 'first dinner · 14 feb',  bg: '#fdf3df', accent: '#d44a35', tape: 'red' },
    { en: 'Mar', kr: '3월', big: 'autumn',     note: 'lygon st gelato season ends · we eat it anyway',              pol: 'lygon st · 03 mar',     bg: '#f6e9d3', accent: '#213e6c', tape: 'blue' },
    { en: 'Apr', kr: '4월', big: 'cold snap',  note: 'first puffer jackets · 김치 weekend · ngv all afternoon',    pol: 'share house · 17 apr',  bg: '#f9ecd1', accent: '#6b7a4a', tape: 'yellow' },
    { en: 'May', kr: '5월', big: 'routines',   note: 'patricia every wednesday · jeongmin learns to make a flat white',  pol: 'patricia · 08 may', bg: '#fae6cf', accent: '#d39836', tape: 'red' },
    { en: 'Jun', kr: '6월', big: 'last weeks', note: 'box hill bingsu run · final trams · letters left on the fridge',  pol: 'st kilda · 21 jun', bg: '#f3e0c1', accent: '#213e6c', tape: 'dots' },
  ];

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <SBPageHeader no="05" en="months together" kr="시간" subKr="2월부터 6월까지" subEn="five months, from feb to june" />

      {/* horizontal washi tape running across as the "timeline" */}
      <div className="washi" style={{
        position: 'absolute', top: 290, left: 60, right: 60, height: 14, opacity: .7
      }} />

      {/* month cards */}
      <div style={{ position: 'absolute', top: 200, left: 80, right: 80, display: 'flex',
                    gap: 18, justifyContent: 'space-between' }}>
        {months.map((m, i) => (
          <div key={m.en} className="lift" style={{
            width: 'calc((100% - 72px) / 5)',
            background: m.bg,
            padding: '18px 16px',
            boxShadow: '0 8px 16px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.06)',
            transform: `rotate(${[-1.5, 1.2, -1, 1.5, -1.2][i]}deg)`,
            position: 'relative',
            zIndex: 5 - i,
          }}>
            <div className={`washi ${m.tape === 'red' ? '' : m.tape}`}
              style={{ position: 'absolute', top: -10, left: '50%', width: 60, marginLeft: -30, height: 14,
                       transform: `rotate(${[-3, 4, -2, 5, -3][i]}deg)` }} />
            <div className="sb-mono" style={{ fontSize: 10, color: m.accent, letterSpacing: '.22em' }}>
              {m.en.toUpperCase()} · 2026
            </div>
            <div className="sb-hand-kr" style={{ fontSize: 30, color: m.accent, lineHeight: 1 }}>{m.kr}</div>
            <div className="sb-hand" style={{ fontSize: 28, color: '#1c1612', lineHeight: 1, marginTop: 6 }}>
              {m.big}
            </div>
            <div className="photo-slot" data-slot={m.pol} style={{ aspectRatio: '1/1', marginTop: 12 }} />
            <div className="sb-hand" style={{ fontSize: 14, color: '#3a2e1c', marginTop: 10, lineHeight: 1.2 }}>
              {m.note}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom rule + arrival/departure stamps */}
      <div style={{ position: 'absolute', bottom: 36, left: 80, display: 'flex', gap: 14, alignItems: 'center' }}>
        <div className="sb-mono" style={{
          padding: '6px 10px', border: '1.5px dashed #1c1612',
          fontSize: 10, letterSpacing: '.18em', background: 'rgba(255,255,255,.4)'
        }}>ARRIVED · 14 FEB</div>
        <div style={{ flex: 1, height: 0, borderTop: '1px dashed rgba(0,0,0,.4)', width: 160 }} />
        <div className="sb-mono" style={{
          padding: '6px 10px', border: '1.5px dashed #d44a35', color: '#d44a35',
          fontSize: 10, letterSpacing: '.18em', background: 'rgba(255,255,255,.4)'
        }}>DEPARTING · 28 JUN</div>
      </div>

      <SBPostit bottom={36} right={80} rotate={4} width={190} bg="#fbd9c9">
        “152 days. not enough.”<br/>
        <span style={{ fontSize: 14, color: '#7a4a2a' }}>— 정민, on the tram home</span>
      </SBPostit>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 06 · PLAYLIST
// ═══════════════════════════════════════════════════════════════
function ScrapbookPlaylist() {
  const tracks = [
    { n: '01', t: '밤편지',                      a: 'IU',                      who: 'JM', note: 'sleeping pill, but nice' },
    { n: '02', t: 'The Less I Know the Better', a: 'Tame Impala',             who: 'W',  note: 'lygon walk anthem' },
    { n: '03', t: '어떻게 이별까지 사랑하겠어',  a: 'AKMU',                    who: 'GB', note: '규보 cried (a bit)' },
    { n: '04', t: 'Never Be Like You',          a: 'Flume',                   who: 'W',  note: 'sunday morning' },
    { n: '05', t: 'Tomboy',                     a: 'Hyukoh',                  who: 'JM', note: 'tram window song' },
    { n: '06', t: 'Cherry-coloured Funk',       a: 'Cocteau Twins',           who: 'GB', note: 'rothko room loop' },
    { n: '07', t: '봄날',                        a: 'BTS',                     who: 'JM', note: 'unironic. fight me.' },
    { n: '08', t: 'Eleanor Put Your Boots On',  a: 'Franz Ferdinand',         who: 'W',  note: 'st kilda pier' },
    { n: '09', t: 'Beautiful',                  a: 'Crush',                   who: 'GB', note: 'kitchen cooking song' },
    { n: '10', t: 'Sometimes',                  a: 'James',                   who: 'W',  note: 'cold brunswick' },
    { n: '11', t: '나의 사춘기에게',            a: 'Bolbbalgan4',             who: 'JM', note: 'walk-home-late song' },
    { n: '12', t: 'Innerbloom',                 a: 'RÜFÜS DU SOL',           who: 'W',  note: 'last side B track' },
  ];
  const [playing, setPlaying] = React.useState(false);
  const [now, setNow] = React.useState(0);

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <SBPageHeader no="06" en="our mixtape" kr="노래" subKr="멜번에서 들은 32곡" subEn="thirty-two songs · side A" />

      {/* Big cassette */}
      <div style={{
        position: 'absolute', top: 200, left: 80, width: 420, height: 260,
        background: '#1c1612', color: '#f3e8cf',
        borderRadius: 10, padding: 22,
        boxShadow: '0 18px 30px rgba(0,0,0,.25), 4px 4px 0 #d44a35',
        transform: 'rotate(-3deg)'
      }}>
        <div className="sb-mono" style={{ fontSize: 10, letterSpacing: '.22em', opacity: .7 }}>SIDE A · OUR MIXTAPE 2026</div>
        <div className="sb-hand" style={{ fontSize: 48, lineHeight: 1, marginTop: 4 }}>
          melbourne <span style={{ color: '#d44a35' }}>♥</span>
        </div>
        <div className="sb-hand-kr" style={{ fontSize: 26, color: '#fbd9c9', lineHeight: 1, marginTop: 2 }}>
          우리 셋의 32곡
        </div>

        {/* Reels */}
        <div style={{ display: 'flex', gap: 50, marginTop: 26, alignItems: 'center', justifyContent: 'center' }}>
          <div className={playing ? 'cassette-spool' : 'cassette-spool'}
            style={{ width: 64, height: 64, animation: playing ? 'spin 3s linear infinite' : 'none' }} />
          <div style={{ flex: 1, height: 6, background: '#d44a35', borderRadius: 3, position: 'relative' }}>
            <div style={{ width: `${(now / tracks.length) * 100}%`, height: '100%', background: '#fbd9c9', borderRadius: 3, transition: 'width .3s' }} />
          </div>
          <div className={playing ? 'cassette-spool' : 'cassette-spool'}
            style={{ width: 64, height: 64, animation: playing ? 'spin 3s linear infinite reverse' : 'none' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
          <button onClick={() => setPlaying(p => !p)} style={{
            background: '#d44a35', color: '#f3e8cf', border: 'none',
            padding: '8px 18px', fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '.16em',
            cursor: 'pointer', borderRadius: 3
          }}>{playing ? '❚❚  PAUSE' : '▶  PLAY'}</button>
          <div className="sb-mono" style={{ fontSize: 10, opacity: .7 }}>
            {tracks[now]?.t} — {tracks[now]?.a}
          </div>
        </div>
      </div>

      {/* Pen-marked liner notes underneath cassette */}
      <SBPostit top={490} left={140} rotate={-5} width={300} bg="#fef4a8">
        “press play.<br/>then dance, even if you’re alone.”<br/>
        <span style={{ fontSize: 14, color: '#7a4a2a' }}>— 규보, on the share house fridge</span>
      </SBPostit>

      {/* Track list */}
      <div style={{ position: 'absolute', top: 200, right: 80, width: 600, bottom: 60,
                    background: '#fbf6e9', padding: '18px 22px',
                    boxShadow: '0 10px 22px rgba(0,0,0,.14), 0 2px 4px rgba(0,0,0,.08)',
                    transform: 'rotate(1deg)' }}>
        <div className="washi blue" style={{ position: 'absolute', top: -10, left: 30, width: 120, height: 16, transform: 'rotate(-2deg)' }} />
        <div className="washi dots" style={{ position: 'absolute', top: -10, right: 30, width: 90, height: 16, transform: 'rotate(3deg)' }} />
        <div className="sb-mono" style={{ fontSize: 10, color: '#7a6648', letterSpacing: '.22em' }}>TRACKLIST · SIDE A · 12 / 32</div>
        <ol style={{ listStyle: 'none', padding: 0, margin: '10px 0 0' }}>
          {tracks.map((tr, i) => {
            const isNow = i === now;
            return (
              <li key={tr.n}
                onClick={() => setNow(i)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '28px 1fr 130px 36px 1fr',
                  alignItems: 'baseline', gap: 10,
                  padding: '5px 6px',
                  borderBottom: '0.5px dotted rgba(0,0,0,.2)',
                  background: isNow ? 'rgba(212,74,53,.1)' : 'transparent',
                  cursor: 'pointer'
                }}>
                <span className="sb-mono" style={{ fontSize: 11, color: isNow ? '#d44a35' : '#7a6648' }}>{tr.n}</span>
                <span className="sb-hand" style={{ fontSize: 19, lineHeight: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tr.t}</span>
                <span className="sb-mono" style={{ fontSize: 11, color: '#544a3a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tr.a}</span>
                <span className="sb-sticker-circle" style={{
                  width: 22, height: 22, fontSize: 10,
                  background: tr.who === 'JM' ? '#213e6c' : tr.who === 'GB' ? '#d44a35' : '#6b7a4a'
                }}>{tr.who}</span>
                <span className="sb-hand" style={{ fontSize: 15, color: '#7a4a2a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tr.note}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

window.ScrapbookTimeline = ScrapbookTimeline;
window.ScrapbookPlaylist = ScrapbookPlaylist;
