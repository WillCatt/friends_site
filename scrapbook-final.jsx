// Final scrapbook sections: Inside Jokes · Letters · Guestbook.

// ═══════════════════════════════════════════════════════════════
// 07 · INSIDE JOKES (corkboard of post-its)
// ═══════════════════════════════════════════════════════════════
function ScrapbookJokeNote({ joke, update, remove }) {
  const editing = !!(window.useEditMode?.().editMode && window.useAuth?.().user);
  const dragHook = window.useSBDragPosition || ((initial) => ({ pos: initial, dragHandlers: {} }));
  const { pos, dragHandlers } = dragHook(
    { left: joke.left || 0, top: joke.top || 0 },
    (next) => update(joke.id, { left: Math.round(next.left), top: Math.round(next.top) }),
    editing
  );

  return (
    <div key={joke.id || joke.text} className={`lift${editing ? ' draggable' : ''}`} {...dragHandlers} style={{
      position: 'absolute', top: pos.top, left: pos.left, width: joke.w,
      background: joke.bg,
      padding: '14px 14px 18px',
      boxShadow: '0 10px 16px rgba(0,0,0,.15), 0 2px 3px rgba(0,0,0,.08)',
      transform: `rotate(${joke.rot}deg)`,
      fontFamily: 'Caveat, cursive', fontWeight: 600, fontSize: 18, lineHeight: 1.15,
      color: '#3a2e1c',
      cursor: editing ? 'grab' : undefined,
    }}>
      {window.EditableText ? (
        <window.EditableText
          tag="div"
          value={joke.text}
          multiline
          style={{ fontSize: 16, color: '#1c1612', lineHeight: 1.25, marginBottom: 4 }}
          onChange={(v) => update(joke.id, { text: v })} />
      ) : (
        <div style={{ fontSize: 16, color: '#1c1612', lineHeight: 1.25, marginBottom: 4 }}>{joke.text}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sb-mono" style={{ fontSize: 10, letterSpacing: '.16em', color: '#7a4a2a' }}>
          — <SBEditableText
            tag="span"
            value={joke.who}
            onChange={(v) => update(joke.id, { who: v })}
          />
        </div>
        {window.DeleteButton && joke.id && (
          <window.DeleteButton onClick={() => remove(joke.id)} />
        )}
      </div>
      {window.ColorSwatch && (
        <window.ColorSwatch value={joke.bg} onChange={(bg) => update(joke.id, { bg })} />
      )}
    </div>
  );
}

function ScrapbookJokes() {
  const store = window.useStore?.();
  const auth  = window.useAuth?.();
  const jokes = store?.content?.jokes || window.DIARY_DEFAULTS?.jokes || [];

  const update = (id, patch) => store?.updateItem?.('jokes', id, patch);
  const remove = (id) => store?.removeItem?.('jokes', id);
  const add = () => {
    const palette = ['#fef4a8', '#fbd9c9', '#dff0d6', '#cde0f2'];
    store?.addItem?.('jokes', {
      id: 'j' + Date.now(),
      who: auth?.user?.profile?.name || 'me',
      text: '"new inside joke..."',
      top: 200 + Math.random() * 350,
      left: 100 + Math.random() * 950,
      rot: (Math.random() * 10) - 5,
      bg: palette[jokes.length % 4],
      w: 230,
    });
  };

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <SBPageHeader no="07" en="inside jokes" kr="농담" subKr="우리만 아는 이야기" subEn="things only we get" />

      {/* decorative arrows behind */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="10" markerHeight="10" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill="#1c1612" />
          </marker>
        </defs>
        <path d="M 290 270 C 380 200, 460 200, 540 250" stroke="#1c1612" strokeWidth="1.5"
          fill="none" strokeDasharray="3 4" markerEnd="url(#arr)" />
        <path d="M 540 540 C 600 500, 680 500, 740 510" stroke="#d44a35" strokeWidth="1.5"
          fill="none" strokeDasharray="3 4" markerEnd="url(#arr)" />
      </svg>

      {jokes.map((j) => (
        <ScrapbookJokeNote key={j.id || j.text} joke={j} update={update} remove={remove} />
      ))}

      {/* Bonus stickers */}
      <div style={{ position: 'absolute', top: 380, left: 670, zIndex: 8, transform: 'rotate(-14deg)' }}>
        <Icons.Magpie size={40} color="#1c1612" />
      </div>
      <div style={{ position: 'absolute', top: 380, left: 295, zIndex: 8, transform: 'rotate(10deg)' }}>
        <Icons.Tram size={42} color="#d44a35" />
      </div>
      <div style={{ position: 'absolute', top: 420, left: 900, zIndex: 8, transform: 'rotate(-6deg)' }}>
        <Icons.GumLeaf size={36} color="#6b7a4a" />
      </div>

      <div style={{ position: 'absolute', bottom: 36, left: 80, right: 80,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="sb-mono" style={{ fontSize: 10, color: '#7a6648', letterSpacing: '.2em' }}>
          {jokes.length} quotes · click any to edit
        </div>
        {window.AddButton && <window.AddButton onClick={add} label="+ ADD JOKE" />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 08 · LETTERS — three handwritten notes
// ═══════════════════════════════════════════════════════════════
function ScrapbookLetters() {
  const store = window.useStore?.();
  const letters = store?.content?.letters || window.DIARY_DEFAULTS?.letters || [];
  const patch = (id, p) => store?.updateItem?.('letters', id, p);
  const remove = (id) => store?.removeItem?.('letters', id);
  const add = () => store?.addItem?.('letters', {
    id: 'l' + Date.now(),
    from: 'Name',
    en: 'Name',
    to: 'Friends',
    bg: '#fef4d4',
    rot: 0,
    accent: '#d44a35',
    body: ['Write a note here.'],
    sign: 'Name',
    date: 'date · place',
  });
  const patchBodyLine = (letter, index, value) => {
    const body = [...(letter.body || [])];
    body[index] = value;
    patch(letter.id, { body });
  };

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <SBPageHeader no="08" en="letters to keep" kr="편지" subKr="고이 접어 둘 편지 셋" subEn="three notes, before we said goodbye" />

      <div style={{ position: 'absolute', top: 200, left: 80, right: 80, bottom: 60,
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {letters.map((l, i) => (
          <div key={l.id || l.en} className="lift" style={{
            background: l.bg, padding: 22,
            transform: `rotate(${l.rot}deg)`,
            boxShadow: '0 12px 24px rgba(0,0,0,.16), 0 2px 4px rgba(0,0,0,.08)',
            position: 'relative',
            display: 'flex', flexDirection: 'column',
            backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 30px, rgba(0,0,0,.06) 30px 31px)',
            backgroundSize: '100% 100%',
          }}>
            {/* tape across top */}
            <div className={`washi ${i === 1 ? 'blue' : i === 2 ? 'yellow' : ''}`}
              style={{ position: 'absolute', top: -10, left: '50%', width: 110, marginLeft: -55, height: 16,
                       transform: `rotate(${[-3, 4, -2][i]}deg)`, opacity: .8 }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                <div className="sb-mono" style={{ fontSize: 9, color: l.accent, letterSpacing: '.22em' }}>
                  FROM · <SBEditableText tag="span" value={l.en} onChange={(v) => patch(l.id, { en: v })} />
                </div>
                <SBEditableText
                  tag="div"
                  className="sb-hand-kr"
                  value={l.from}
                  onChange={(v) => patch(l.id, { from: v })}
                  style={{ fontSize: 38, color: l.accent, lineHeight: 1.25, marginTop: 2 }}
                />
              </div>
              <div className="sb-mono" style={{ fontSize: 9, color: '#7a4a2a', letterSpacing: '.22em', textAlign: 'right', whiteSpace: 'nowrap', lineHeight: 1.6, paddingTop: 2 }}>
                TO<br/>
                <SBEditableText tag="span" value={l.to} onChange={(v) => patch(l.id, { to: v })} />
              </div>
            </div>

            <div style={{ marginTop: 22, flex: 1 }}>
              {(l.body || []).map((line, j) => (
                <SBEditableText
                  key={j}
                  tag="p"
                  className="sb-hand"
                  value={line}
                  onChange={(v) => patchBodyLine(l, j, v)}
                  style={{
                    fontSize: 17, lineHeight: '34px',
                    margin: 0, color: '#1c1612', textWrap: 'pretty'
                  }}
                />
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
              <SBEditableText
                tag="div"
                className="sb-hand"
                value={`— ${l.sign}`}
                onChange={(v) => patch(l.id, { sign: v.replace(/^—\s*/, '') })}
                style={{ fontSize: 28, color: l.accent, lineHeight: 1, fontStyle: 'italic' }}
              />
              <SBEditableText
                tag="div"
                className="sb-mono"
                value={l.date}
                onChange={(v) => patch(l.id, { date: v })}
                style={{ fontSize: 9, color: '#7a4a2a', letterSpacing: '.16em' }}
              />
            </div>
            {window.DeleteButton && l.id && (
              <window.DeleteButton onClick={() => remove(l.id)}
                style={{ position: 'absolute', top: 8, right: 8 }} />
            )}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 24, right: 80 }}>
        {window.AddButton && <window.AddButton onClick={add} label="+ ADD LETTER" />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 09 · GUESTBOOK
// ═══════════════════════════════════════════════════════════════
function ScrapbookGuestbook() {
  const store = window.useStore?.();
  const auth  = window.useAuth?.();
  const signs = store?.content?.guestbook || window.DIARY_DEFAULTS?.guestbook || [];
  const [name, setName] = React.useState('');
  const [msg, setMsg]  = React.useState('');

  const add = () => {
    if (!name.trim() || !msg.trim()) return;
    const palette = ['#213e6c', '#d44a35', '#6b7a4a', '#d39836'];
    const entry = {
      id: 'g' + Date.now(),
      name: name.trim(),
      msg: msg.trim(),
      rot: (Math.random() * 6) - 3,
      color: palette[signs.length % palette.length],
      by: auth?.user?.profile?.name || null,
    };
    if (store?.addItem) {
      store.addItem('guestbook', entry);
    } else {
      // localStorage fallback (no provider)
      try {
        const list = JSON.parse(localStorage.getItem('guestbook') || '[]');
        localStorage.setItem('guestbook', JSON.stringify([...list, entry]));
      } catch {}
    }
    setName(''); setMsg('');
  };

  const removeSign = (id) => store?.removeItem?.('guestbook', id);

  return (
    <div className="scrapbook" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <SBPageHeader no="09" en="sign the book" kr="방명록" subKr="잠깐 들렀다 가는 사람도 환영해" subEn="anyone who scrolled this far, sign here" />

      {/* lined paper book */}
      <div style={{
        position: 'absolute', top: 200, left: 80, right: 80, bottom: 240,
        background: '#fbf6e9',
        padding: '24px 32px',
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 38px, rgba(80,50,15,.18) 38px 39px)',
        boxShadow: '0 12px 26px rgba(0,0,0,.14), 0 2px 4px rgba(0,0,0,.08)',
        overflow: 'hidden',
        position: 'absolute'
      }}>
        {/* red margin line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 70, width: 1, background: 'rgba(212,74,53,.5)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 74, width: 1, background: 'rgba(212,74,53,.3)' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, paddingLeft: 56 }}>
          {signs.slice(0, 18).map((s, i) => (
            <div key={s.id || i} style={{
              padding: '6px 12px',
              transform: `rotate(${s.rot}deg)`,
              transformOrigin: 'left center',
              position: 'relative'
            }}>
              <SBEditableText
                tag="div"
                className="sb-hand"
                value={s.msg}
                onChange={(v) => store?.updateItem?.('guestbook', s.id, { msg: v })}
                style={{ fontSize: 22, lineHeight: '32px', color: '#1c1612', textWrap: 'pretty' }}
              />
              <SBEditableText
                tag="div"
                className="sb-hand"
                value={`— ${s.name}`}
                onChange={(v) => store?.updateItem?.('guestbook', s.id, { name: v.replace(/^—\s*/, '') })}
                style={{ fontSize: 22, color: s.color, lineHeight: '32px', fontStyle: 'italic' }}
              />
              {window.DeleteButton && s.id && (
                <window.DeleteButton onClick={() => removeSign(s.id)}
                  style={{ position: 'absolute', top: 4, right: 4 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* sign-in form */}
      <div style={{
        position: 'absolute', bottom: 80, left: 80, right: 80,
        background: '#1c1612', color: '#f3e8cf',
        padding: 18,
        display: 'grid', gridTemplateColumns: '160px 1fr 140px', gap: 12, alignItems: 'center',
        boxShadow: '0 8px 20px rgba(0,0,0,.18)'
      }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="your name · 이름"
          style={{
            background: 'transparent', border: 'none', borderBottom: '1.5px solid #f3e8cf',
            color: '#f3e8cf', padding: '8px 4px', fontFamily: 'Caveat, cursive', fontSize: 24,
            outline: 'none'
          }} />
        <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="leave a memory · 메모를 남겨주세요"
          onKeyDown={(e) => e.key === 'Enter' && add()}
          style={{
            background: 'transparent', border: 'none', borderBottom: '1.5px solid #f3e8cf',
            color: '#f3e8cf', padding: '8px 4px', fontFamily: 'Caveat, cursive', fontSize: 24,
            outline: 'none'
          }} />
        <button onClick={add} style={{
          background: '#d44a35', color: '#f3e8cf', border: 'none',
          padding: '10px 14px', fontFamily: 'IBM Plex Mono', fontSize: 11, letterSpacing: '.18em',
          cursor: 'pointer'
        }}>SIGN ↵</button>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: 80, right: 80,
                    display: 'flex', justifyContent: 'space-between' }}>
        <div className="sb-mono" style={{ fontSize: 10, color: '#7a6648', letterSpacing: '.2em' }}>
          {signs.length} entries · synced when signed in
        </div>
        <div className="sb-mono" style={{ fontSize: 10, color: '#d44a35', letterSpacing: '.2em' }}>
          ── END · 끝 ──
        </div>
      </div>
    </div>
  );
}

window.ScrapbookJokes = ScrapbookJokes;
window.ScrapbookLetters = ScrapbookLetters;
window.ScrapbookGuestbook = ScrapbookGuestbook;
