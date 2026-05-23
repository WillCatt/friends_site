// SCRAPBOOK direction — taped polaroids, washi tape, handwritten captions.
// Three artboards: ScrapbookCover, ScrapbookPhotos, ScrapbookFood.

const SBTape = ({ left, top, right, width = 90, rotate = 0, variant = 'red', z = 5 }) => (
  <div className={`washi ${variant === 'red' ? '' : variant}`}
       style={{ left, top, right, width, transform: `rotate(${rotate}deg)`, zIndex: z }} />
);

const SBPolaroid = ({
  width = 180, slot, caption, captionKr, imageUrl, rotate = 0,
  top, left, right, bottom, zIndex = 2, tape = true, tapeColor = 'red',
  onImageChange, onCaptionChange, onCaptionKrChange,
}) => (
  <div className="polaroid lift" style={{
    position: 'absolute', width, top, left, right, bottom,
    transform: `rotate(${rotate}deg)`, zIndex, '--hover-rot': `${rotate}deg`
  }}>
    {tape && (
      <div className={`washi ${tapeColor === 'red' ? '' : tapeColor}`}
           style={{ top: -8, left: '50%', width: 60, marginLeft: -30, height: 14, opacity: .8 }} />
    )}
    <SBEditableImage
      src={imageUrl}
      slot={slot}
      onChange={onImageChange}
      className="photo-slot-wrap"
      style={{ aspectRatio: '1/1', position: 'relative' }}
    />
    {caption && (
      <div style={{ marginTop: 6, textAlign: 'center', lineHeight: 1.1 }}>
        <SBEditableText
          tag="div"
          className="sb-hand"
          value={caption}
          onChange={onCaptionChange}
          style={{ fontSize: 18, color: '#1c1612' }}
        />
        <SBEditableText
          tag="div"
          className="sb-hand-kr"
          value={captionKr}
          onChange={onCaptionKrChange}
          placeholder="한글 캡션"
          style={{ fontSize: 13, color: '#544a3a' }}
        />
      </div>
    )}
  </div>
);

const SBPostit = ({ children, top, left, right, bottom, rotate = -2, bg = '#fef4a8', width = 140, style }) => (
  <div className="lift" style={{
    position: 'absolute', top, left, right, bottom, width,
    background: bg,
    padding: '14px 14px 18px',
    boxShadow: '0 10px 16px rgba(0,0,0,.15), 0 2px 3px rgba(0,0,0,.08)',
    transform: `rotate(${rotate}deg)`,
    fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: 18, lineHeight: 1.15,
    color: '#3a2e1c',
    '--hover-rot': `${rotate}deg`,
    ...style,
  }}>{children}</div>
);

function SBEditableText({ tag = 'span', value, onChange, className, style, multiline = false, placeholder = '...' }) {
  const Editable = window.EditableText;
  if (Editable) {
    return (
      <Editable
        tag={tag}
        value={value}
        onChange={onChange}
        className={className}
        style={style}
        multiline={multiline}
        placeholder={placeholder}
      />
    );
  }
  const Tag = tag;
  return <Tag className={className} style={style}>{value || ''}</Tag>;
}

function SBEditableImage({ src, slot, onChange, style, className }) {
  const EditableImage = window.EditableImage;
  if (EditableImage) {
    return (
      <EditableImage
        src={src}
        slot={slot}
        onChange={onChange}
        style={style}
        className={className}
      />
    );
  }
  return <div className={`photo-slot ${className || ''}`} data-slot={slot} style={style} />;
}

// ─── 01. Cover ────────────────────────────────────────────────
function ScrapbookCover() {
  const store = window.useStore?.();
  const cover = store?.content?.cover || window.DIARY_DEFAULTS?.cover || {};
  const polaroids = cover.polaroids || window.DIARY_DEFAULTS?.cover?.polaroids || [];
  const updateCover = (field, value) => store?.update?.(`cover.${field}`, value);
  const updatePolaroid = (id, patch) => store?.updateItem?.('cover.polaroids', id, patch);

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* page-edge tear shadow */}
      <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 60px rgba(80,50,20,.18)', pointerEvents: 'none' }} />

      {/* HEADER: handwritten title + Korean subtitle */}
      <div style={{ position: 'absolute', top: 44, left: 56, right: 56, zIndex: 4 }}>
        <SBEditableText
          tag="div"
          className="sb-mono"
          value={cover.kicker}
          onChange={(v) => updateCover('kicker', v)}
          style={{ fontSize: 11, color: '#7a6648', letterSpacing: '.22em' }}
        />
        <h1 className="sb-hand" style={{
          fontSize: 96, lineHeight: .95, margin: '4px 0 0', color: '#1c1612',
          letterSpacing: '-0.02em'
        }}>
          <SBEditableText tag="span" value={cover.titleA} onChange={(v) => updateCover('titleA', v)} /><br/>
          <SBEditableText tag="span" value={cover.titleB} onChange={(v) => updateCover('titleB', v)} style={{ color: '#d44a35' }} />{' '}
          <SBEditableText tag="span" value={cover.titleC} onChange={(v) => updateCover('titleC', v)} style={{ fontStyle: 'italic' }} />
        </h1>
        <div className="sb-hand-kr" style={{ fontSize: 34, marginTop: 4, color: '#213e6c' }}>
          <SBEditableText tag="span" value={cover.subtitleKr} onChange={(v) => updateCover('subtitleKr', v)} />
          <span style={{ color: '#1c1612', fontSize: 22 }}> · <SBEditableText tag="span" value={cover.subtitleEn} onChange={(v) => updateCover('subtitleEn', v)} /></span>
        </div>
      </div>

      {/* Hero polaroid cluster (right side) */}
      <SBPolaroid width={220} slot={polaroids[0]?.slot} caption={polaroids[0]?.caption} captionKr={polaroids[0]?.captionKr}
        imageUrl={polaroids[0]?.imageUrl}
        onImageChange={(url) => updatePolaroid(polaroids[0]?.id, { imageUrl: url })}
        onCaptionChange={(caption) => updatePolaroid(polaroids[0]?.id, { caption })}
        onCaptionKrChange={(captionKr) => updatePolaroid(polaroids[0]?.id, { captionKr })}
        top={70} right={70} rotate={-4} zIndex={5} tapeColor="blue" />
      <SBPolaroid width={170} slot={polaroids[1]?.slot} caption={polaroids[1]?.caption} captionKr={polaroids[1]?.captionKr}
        imageUrl={polaroids[1]?.imageUrl}
        onImageChange={(url) => updatePolaroid(polaroids[1]?.id, { imageUrl: url })}
        onCaptionChange={(caption) => updatePolaroid(polaroids[1]?.id, { caption })}
        onCaptionKrChange={(captionKr) => updatePolaroid(polaroids[1]?.id, { captionKr })}
        top={250} right={250} rotate={5} zIndex={4} tapeColor="yellow" />
      <SBPolaroid width={150} slot={polaroids[2]?.slot} caption={polaroids[2]?.caption} captionKr={polaroids[2]?.captionKr}
        imageUrl={polaroids[2]?.imageUrl}
        onImageChange={(url) => updatePolaroid(polaroids[2]?.id, { imageUrl: url })}
        onCaptionChange={(caption) => updatePolaroid(polaroids[2]?.id, { caption })}
        onCaptionKrChange={(captionKr) => updatePolaroid(polaroids[2]?.id, { captionKr })}
        top={340} right={110} rotate={-7} zIndex={6} tapeColor="red" />

      {/* TOC — taped strip down the left */}
      <div style={{ position: 'absolute', left: 64, top: 320, width: 280, zIndex: 3 }}>
        <SBTape left={-12} top={-10} width={70} rotate={-8} variant="blue" />
        <div className="sb-mono" style={{ fontSize: 10, color: '#7a6648', letterSpacing: '.2em', marginBottom: 10 }}>
          INSIDE / 차례
        </div>
        <ol style={{
          listStyle: 'none', padding: 0, margin: 0,
          fontFamily: 'Caveat, cursive', fontSize: 26, lineHeight: 1.3, color: '#1c1612'
        }}>
          {[
            ['02', 'polaroid wall', '사진'],
            ['03', 'what we ate', '음식'],
            ['04', 'our melbourne map', '지도'],
            ['05', 'months together', '시간'],
            ['06', 'the playlist', '노래'],
            ['07', 'inside jokes', '농담'],
            ['08', 'letters to keep', '편지'],
            ['09', 'sign the book', '방명록'],
          ].map(([n, en, kr]) => (
            <li key={n} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '1px 0' }}>
              <span className="sb-mono" style={{ fontSize: 11, color: '#d44a35', minWidth: 22 }}>{n}</span>
              <span style={{ flex: '0 0 auto' }}>{en}</span>
              <span style={{ flex: 1, borderBottom: '1px dotted rgba(0,0,0,.35)', marginBottom: 6 }} />
              <span className="sb-hand-kr" style={{ fontSize: 18, color: '#213e6c' }}>{kr}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Date stamp & stickers */}
      <div style={{ position: 'absolute', bottom: 36, left: 64, zIndex: 3, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div className="sb-mono" style={{
          padding: '6px 10px', border: '1.5px solid #1c1612',
          fontSize: 10, letterSpacing: '.18em', color: '#1c1612', background: 'rgba(255,255,255,.4)'
        }}>
          <SBEditableText tag="span" value={cover.dateRange} onChange={(v) => updateCover('dateRange', v)} />
        </div>
        <div className="sb-sticker-circle" style={{ width: 46, height: 46, background: '#d44a35', fontSize: 18 }}>멜번</div>
        <div className="sb-sticker-circle" style={{ width: 38, height: 38, background: '#213e6c', fontSize: 13 }}>♥</div>
        <Icons.GumLeaf size={28} color="#6b7a4a" />
      </div>

      {/* Audio toggle — styled as a cassette (decorative in diary mode) */}
      <div className="cover-cassette" style={{
        position: 'absolute', bottom: 36, right: 64, width: 180, zIndex: 6,
        background: '#1c1612', color: '#f3e8cf', borderRadius: 6,
        padding: '10px 12px', boxShadow: '0 6px 14px rgba(0,0,0,.25)',
        transform: 'rotate(2deg)'
      }}>
        <div className="sb-mono" style={{ fontSize: 9, letterSpacing: '.2em', opacity: .7 }}>SIDE A · PLAY</div>
        <div className="sb-hand" style={{ fontSize: 22, lineHeight: 1 }}>our songs ♫</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f3e8cf',
                        boxShadow: 'inset 0 0 0 4px #1c1612, inset 0 0 0 5px #f3e8cf' }} />
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f3e8cf',
                        boxShadow: 'inset 0 0 0 4px #1c1612, inset 0 0 0 5px #f3e8cf' }} />
          <div style={{ flex: 1, height: 4, background: '#d44a35', borderRadius: 2 }} />
          <span className="sb-mono" style={{ fontSize: 9 }}>▶</span>
        </div>
      </div>

      {/* Floating washi at top */}
      <SBTape left={420} top={32} width={110} rotate={6} variant="yellow" z={1} />
      <SBTape right={300} top={20} width={140} rotate={-4} variant="dots" z={1} />

      {/* Page corner sticker */}
      <div style={{ position: 'absolute', top: 24, right: 28, zIndex: 7,
                    width: 60, height: 60, borderRadius: '50%',
                    background: '#fef4a8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 8px rgba(0,0,0,.15)', transform: 'rotate(8deg)',
                    fontFamily: 'Gaegu, cursive', fontWeight: 700, fontSize: 12,
                    color: '#1c1612', textAlign: 'center', lineHeight: 1 }}>
          NO.<br/><span style={{ fontSize: 22 }}>01</span>
      </div>

      <SBPostit top={620} left={420} rotate={-4} width={180}>
        <SBEditableText
          tag="div"
          value={cover.postit}
          onChange={(v) => updateCover('postit', v)}
          multiline
          style={{ whiteSpace: 'pre-line' }}
        />
      </SBPostit>
    </div>
  );
}

// ─── 02. Photo Wall ───────────────────────────────────────────
function ScrapbookPhotos() {
  const polas = [
    { w: 180, slot: 'queen vic mkt · saturday', cap: 'brekkie run', kr: '브런치',  top: 100, left: 70, rot: -4, tape: 'red' },
    { w: 170, slot: 'lune · 7:40am queue', cap: 'lune queue', kr: '크루아상',     top: 90, left: 280, rot: 3, tape: 'blue' },
    { w: 200, slot: 'st kilda pier · golden hr', cap: 'penguins?', kr: '펭귄 어디?', top: 80, left: 480, rot: -2, tape: 'yellow' },
    { w: 180, slot: 'naked for satan · pintxos', cap: 'pintxos night',         top: 80, left: 720, rot: 5, tape: 'red' },
    { w: 180, slot: 'glen waverley · 한식', cap: 'k-bbq',  kr: '돼지갈비',         top: 90, left: 950, rot: -3, tape: 'dots' },
    { w: 170, slot: 'carlton gardens · picnic', cap: 'picnic', kr: '소풍',     top: 340, left: 120, rot: 4, tape: 'blue' },
    { w: 190, slot: 'pellegrini’s · 1pm', cap: 'first granita',                top: 340, left: 320, rot: -3, tape: 'yellow' },
    { w: 180, slot: 'brunswick · winter', cap: 'cold hands', kr: '추워',         top: 360, left: 540, rot: 6, tape: 'red' },
    { w: 170, slot: 'ngv · rothko room', cap: 'just sat there', kr: '말없이',   top: 350, left: 760, rot: -5, tape: 'blue' },
    { w: 180, slot: 'box hill · bingsu', cap: 'bingsu run', kr: '빙수',         top: 360, left: 970, rot: 2, tape: 'dots' },
  ];

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Top binder strip */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40,
                    background: 'linear-gradient(180deg, rgba(120,80,40,.18), transparent)' }} />
      <div style={{ position: 'absolute', top: 36, left: 56, right: 56, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'baseline', zIndex: 3 }}>
        <div>
          <div className="sb-mono" style={{ fontSize: 11, color: '#7a6648', letterSpacing: '.22em' }}>
            02 · POLAROID WALL · 사진
          </div>
          <h2 className="sb-hand" style={{ fontSize: 64, margin: '2px 0 0', lineHeight: .9, color: '#1c1612' }}>
            the photo wall <span style={{ color: '#d44a35' }}>↓</span>
          </h2>
          <div className="sb-hand-kr" style={{ fontSize: 22, color: '#213e6c', marginTop: 2 }}>
            드래그해서 옮겨도 돼 <span className="sb-hand" style={{ color: '#1c1612' }}>· drag any photo anywhere</span>
          </div>
        </div>
        <div className="sb-mono" style={{
          padding: '6px 10px', border: '1.5px solid #1c1612',
          fontSize: 10, letterSpacing: '.18em', background: 'rgba(255,255,255,.5)',
          alignSelf: 'flex-start'
        }}>72 PHOTOS · 14 PLACES</div>
      </div>

      {/* Polaroids */}
      {polas.map((p, i) => (
        <SBPolaroid key={i} width={p.w} slot={p.slot} caption={p.cap} captionKr={p.kr}
          rotate={p.rot} top={p.top} left={p.left} zIndex={2 + (i % 4)} tapeColor={p.tape} />
      ))}

      {/* Sticker overlays scattered */}
      <div style={{ position: 'absolute', top: 270, left: 250, zIndex: 8, transform: 'rotate(-12deg)' }}>
        <div className="sb-sticker-circle" style={{ width: 56, height: 56, background: '#213e6c', fontSize: 14, padding: 6, textAlign: 'center', lineHeight: 1 }}>좋은<br/>날</div>
      </div>
      <div style={{ position: 'absolute', top: 540, left: 700, zIndex: 8, transform: 'rotate(8deg)' }}>
        <Icons.Pouch size={40} color="#d44a35" />
      </div>
      <div style={{ position: 'absolute', top: 300, left: 1090, zIndex: 8, transform: 'rotate(15deg)' }}>
        <Icons.GumLeaf size={36} color="#6b7a4a" />
      </div>

      {/* Post-its / annotations */}
      <SBPostit top={600} left={80} rotate={-5} width={170} bg="#fef4a8">
        “take more photos<br/>of jeongmin laughing!”
      </SBPostit>
      <SBPostit top={620} left={1000} rotate={4} width={160} bg="#fbd9c9">
        film roll #3<br/><span style={{ fontSize: 14, color: '#7a4a2a' }}>still at the lab</span>
      </SBPostit>

      {/* Bottom strip */}
      <div style={{ position: 'absolute', bottom: 24, left: 56, right: 56, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
        <div className="sb-mono" style={{ fontSize: 10, color: '#7a6648', letterSpacing: '.2em' }}>
          DROP IMAGES INTO THE SLOTS · 사진을 드래그하세요
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['all', '규보', '정민', 'will', 'food', 'streets'].map((t, i) => (
            <span key={t} className="sb-mono" style={{
              padding: '4px 10px', borderRadius: 999,
              background: i === 0 ? '#1c1612' : 'rgba(255,255,255,.55)',
              color: i === 0 ? '#f3e8cf' : '#1c1612',
              fontSize: 10, letterSpacing: '.14em', border: '1px solid #1c1612'
            }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 03. Food Diary ───────────────────────────────────────────
function ScrapbookFood() {
  const store = window.useStore?.();
  const editing = !!(window.useEditMode?.().editMode && window.useAuth?.().user);
  const header = store?.content?.foodHeader || window.DIARY_DEFAULTS?.foodHeader || {};
  const dishes = store?.content?.food || window.DIARY_DEFAULTS?.food || [];
  const receipt = store?.content?.foodReceipt || window.DIARY_DEFAULTS?.foodReceipt || '';
  const signature = store?.content?.foodSignature || window.DIARY_DEFAULTS?.foodSignature || '';
  const patch = (id, p) => store?.updateItem?.('food', id, p);
  const remove = (id) => store?.removeItem?.('food', id);
  const add = () => store?.addItem?.('food', {
    id: 'f' + Date.now(),
    name: 'new dish',
    kr: '',
    place: 'place',
    rating: 5,
    note: 'memory',
    imageUrl: null,
  });

  const Star = ({ filled, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={!editing}
      style={{
        color: filled ? '#d44a35' : '#cbb88e',
        fontSize: 14,
        lineHeight: 1,
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: editing ? 'pointer' : 'default',
      }}>★</button>
  );

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 40, left: 56, right: 56, zIndex: 3 }}>
        <SBEditableText
          tag="div"
          className="sb-mono"
          value={header.kicker}
          onChange={(v) => store?.update?.('foodHeader.kicker', v)}
          style={{ fontSize: 11, color: '#7a6648', letterSpacing: '.22em' }}
        />
        <h2 className="sb-hand" style={{ fontSize: 72, margin: '2px 0 0', lineHeight: .9, color: '#1c1612' }}>
          <SBEditableText tag="span" value={header.title} onChange={(v) => store?.update?.('foodHeader.title', v)} />{' '}
          <SBEditableText tag="span" value={header.aside} onChange={(v) => store?.update?.('foodHeader.aside', v)} style={{ color: '#d44a35', fontStyle: 'italic' }} />
        </h2>
      </div>

      {/* Receipt header */}
      <div style={{ position: 'absolute', top: 60, right: 56, width: 200, zIndex: 4,
                    background: '#fdf8ea', padding: '12px 14px', transform: 'rotate(3deg)',
                    boxShadow: '0 8px 16px rgba(0,0,0,.12)', border: '1px dashed rgba(0,0,0,.2)' }}>
        <SBEditableText
          tag="div"
          className="sb-mono"
          value={header.receiptTitle}
          onChange={(v) => store?.update?.('foodHeader.receiptTitle', v)}
          style={{ fontSize: 9, letterSpacing: '.16em', textAlign: 'center', borderBottom: '1px dashed rgba(0,0,0,.3)', paddingBottom: 6 }}
        />
        <SBEditableText
          tag="div"
          className="sb-mono"
          value={receipt}
          multiline
          onChange={(v) => store?.update?.('foodReceipt', v)}
          style={{ fontSize: 10, marginTop: 6, lineHeight: 1.5, whiteSpace: 'pre-line' }}
        />
      </div>

      {/* Dish grid */}
      <div style={{ position: 'absolute', top: 200, left: 56, right: 56, bottom: 60,
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)',
                    gap: 24 }}>
        {dishes.map((d, i) => (
          <div key={d.id || d.name} className="lift" style={{
            background: '#fbf6e9', padding: 16, position: 'relative',
            boxShadow: '0 6px 14px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.08)',
            transform: `rotate(${[-1.5, 1, -.5, 1.5, -1, .8][i]}deg)`,
            display: 'flex', gap: 14
          }}>
            <SBTape left={'50%'} top={-8} width={56} rotate={(i % 2 ? 4 : -4)}
              variant={['red','blue','yellow','dots','red','blue'][i]} />
            <SBEditableImage
              src={d.imageUrl}
              slot={d.kr}
              onChange={(url) => patch(d.id, { imageUrl: url })}
              style={{ width: 110, height: 110, flex: '0 0 110px' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <SBEditableText
                tag="div"
                className="sb-hand"
                value={d.name}
                onChange={(v) => patch(d.id, { name: v })}
                style={{ fontSize: 26, lineHeight: 1, color: '#1c1612' }}
              />
              <SBEditableText
                tag="div"
                className="sb-hand-kr"
                value={d.kr}
                onChange={(v) => patch(d.id, { kr: v })}
                placeholder="한글"
                style={{ fontSize: 18, color: '#213e6c', marginTop: -2 }}
              />
              <div className="sb-mono" style={{ fontSize: 9, color: '#7a6648', marginTop: 8, letterSpacing: '.1em' }}>
                <SBEditableText
                  tag="span"
                  value={d.place}
                  onChange={(v) => patch(d.id, { place: v })}
                />
              </div>
              <div style={{ marginTop: 4 }}>
                {[1,2,3,4,5].map(n => (
                  <Star key={n} filled={n <= d.rating} onClick={() => patch(d.id, { rating: n })} />
                ))}
              </div>
              <SBEditableText
                tag="div"
                className="sb-hand"
                value={d.note}
                onChange={(v) => patch(d.id, { note: v })}
                multiline
                style={{ fontSize: 14, color: '#544a3a', marginTop: 4, lineHeight: 1.2 }}
              />
            </div>
            {window.DeleteButton && d.id && (
              <window.DeleteButton onClick={() => remove(d.id)}
                style={{ position: 'absolute', top: 8, right: 8 }} />
            )}
          </div>
        ))}
      </div>

      {/* Bottom signature */}
      <div style={{ position: 'absolute', bottom: 20, left: 56, right: 56, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sb-hand-kr" style={{ fontSize: 18, color: '#213e6c' }}>
          <SBEditableText
            tag="span"
            value={signature}
            onChange={(v) => store?.update?.('foodSignature', v)}
          />
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {window.AddButton && <window.AddButton onClick={add} label="+ ADD DISH" />}
          <Icons.Cup size={28} color="#1c1612" />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScrapbookCover, ScrapbookPhotos, ScrapbookFood,
                        SBPolaroid, SBTape, SBPostit, SBEditableText, SBEditableImage });
