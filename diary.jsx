// Diary shell — scroll-snap pages + sticky chrome + edit mode.

function useFitToViewport(designW = 1280, designH = 880, margin = 60) {
  React.useEffect(() => {
    const apply = () => {
      const sx = (window.innerWidth - margin) / designW;
      const sy = (window.innerHeight - margin) / designH;
      const s = Math.min(sx, sy, 1);
      document.documentElement.style.setProperty('--page-scale', String(s));
    };
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);
}

function CassetteToggle({ playing, setPlaying }) {
  return (
    <div className={`cassette${playing ? ' playing' : ''}`} onClick={() => setPlaying(p => !p)}>
      <div className="sb-mono" style={{ fontSize: 9, letterSpacing: '.22em', opacity: .7 }}>
        SIDE A · {playing ? 'PLAYING' : 'PAUSED'}
      </div>
      <div className="sb-hand" style={{ fontSize: 22, lineHeight: 1 }}>
        {playing ? 'our songs ♫' : 'press play'}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <div className="cassette-spool" />
        <div className="cassette-spool" style={{ animationDirection: 'reverse' }} />
        <div style={{ flex: 1, height: 4, background: '#d44a35', borderRadius: 2 }} />
        <span className="sb-mono" style={{ fontSize: 11 }}>{playing ? '❚❚' : '▶'}</span>
      </div>
    </div>
  );
}

const SECTIONS = [
  { id: 's01', label: 'Cover',     kr: '표지',   Comp: 'ScrapbookCover' },
  { id: 's02', label: 'Photos',    kr: '사진',   Comp: 'DraggablePhotos' },
  { id: 's03', label: 'Food',      kr: '음식',   Comp: 'ScrapbookFood' },
  { id: 's04', label: 'Map',       kr: '지도',   Comp: 'ScrapbookMap' },
  { id: 's05', label: 'Timeline',  kr: '시간',   Comp: 'ScrapbookTimeline' },
  { id: 's06', label: 'Playlist',  kr: '노래',   Comp: 'ScrapbookPlaylist' },
  { id: 's07', label: 'Jokes',     kr: '농담',   Comp: 'ScrapbookJokes' },
  { id: 's08', label: 'Letters',   kr: '편지',   Comp: 'ScrapbookLetters' },
  { id: 's09', label: 'Guestbook', kr: '방명록', Comp: 'ScrapbookGuestbook' },
];

function DiaryBody() {
  useFitToViewport();
  const { editMode } = useEditMode();
  const [playing, setPlaying] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [signInOpen, setSignInOpen] = React.useState(false);

  // Toggle .editing class on body so CSS can highlight editable surfaces
  React.useEffect(() => {
    document.body.classList.toggle('editing', editMode);
  }, [editMode]);

  // Track active page
  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.5) {
            const idx = parseInt(e.target.dataset.idx, 10);
            if (!Number.isNaN(idx)) setActiveIdx(idx);
          }
        }
      },
      { threshold: [0.5] }
    );
    document.querySelectorAll('[data-page]').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (idx) => {
    document.querySelector(`[data-page][data-idx="${idx}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <React.Fragment>
      <div className="page-counter">
        {String(activeIdx + 1).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
        <span style={{ marginLeft: 8, color: '#7a6648' }}>· {SECTIONS[activeIdx]?.label}</span>
      </div>

      <nav className="nav-strip" aria-label="Pages">
        {SECTIONS.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} className={i === activeIdx ? 'active' : ''}
            onClick={(e) => { e.preventDefault(); scrollTo(i); }}>
            <span className="dot" />
            <span>{String(i + 1).padStart(2, '0')} · {s.label} · {s.kr}</span>
          </a>
        ))}
      </nav>

      <EditChrome onSignInClick={() => setSignInOpen(true)} />
      {signInOpen && <SignInModal onClose={() => setSignInOpen(false)} />}

      <CassetteToggle playing={playing} setPlaying={setPlaying} />

      {SECTIONS.map((s, i) => {
        const Comp = window[s.Comp];
        return (
          <section key={s.id} id={s.id} className="diary-page" data-page data-idx={i}
            data-screen-label={`${String(i+1).padStart(2,'0')} ${s.label}`}>
            <div className="diary-canvas">
              {Comp ? <Comp /> : <div style={{ padding: 80 }}>missing: {s.Comp}</div>}
            </div>
          </section>
        );
      })}
    </React.Fragment>
  );
}

function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <EditModeProvider>
          <DiaryBody />
        </EditModeProvider>
      </AuthProvider>
    </StoreProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
