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

function CassetteToggle({ track, playing, onToggle, onPrev, onNext }) {
  const hasAudio = !!track?.url;
  return (
    <div className={`cassette${playing ? ' playing' : ''}`} onClick={onToggle}>
      <div className="sb-mono" style={{ fontSize: 9, letterSpacing: '.22em', opacity: .7 }}>
        SIDE A · {playing && hasAudio ? 'PLAYING' : playing ? 'SELECTED' : 'PAUSED'}
      </div>
      <div className="sb-hand" style={{ fontSize: 22, lineHeight: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {track?.t || 'press play'}
      </div>
      <div className="sb-mono" style={{ fontSize: 9, letterSpacing: '.12em', opacity: .65, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {track?.a || 'our songs'}
      </div>
      <div className="sb-mono" style={{ fontSize: 8, letterSpacing: '.12em', opacity: .5, marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {hasAudio ? 'AUDIO LINKED' : 'ADD AUDIO URL ON PAGE 06'}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <div className="cassette-spool" />
        <div className="cassette-spool" style={{ animationDirection: 'reverse' }} />
        <div style={{ flex: 1, height: 4, background: '#d44a35', borderRadius: 2 }} />
        <span className="sb-mono" style={{ fontSize: 11 }}>{playing ? '❚❚' : '▶'}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button type="button" onClick={(e) => { e.stopPropagation(); onPrev?.(); }} className="cassette-skip">PREV</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onNext?.(); }} className="cassette-skip">NEXT</button>
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
  const store = useStore();
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [signInOpen, setSignInOpen] = React.useState(false);
  const audioRef = React.useRef(null);
  const tracks = store?.content?.playlist || [];
  const player = store?.content?.player || {};
  const currentIdx = Math.max(0, tracks.findIndex(t => t.id === player.currentTrackId));
  const currentTrack = tracks[currentIdx] || tracks[0] || null;
  const setPlaying = (value) => {
    const next = typeof value === 'function' ? value(!!player.playing) : value;
    if (!player.currentTrackId && currentTrack?.id) store?.update?.('player.currentTrackId', currentTrack.id);
    store?.update?.('player.playing', next);
  };
  const setCurrentTrack = (idx) => {
    const track = tracks[(idx + tracks.length) % tracks.length];
    if (track) store?.update?.('player.currentTrackId', track.id);
  };

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack?.url) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load?.();
      return;
    }

    if (audio.getAttribute('src') !== currentTrack.url) audio.setAttribute('src', currentTrack.url);
    if (player.playing) {
      audio.play().catch((err) => {
        console.warn('Audio play failed', err);
        store?.update?.('player.playing', false);
      });
    } else {
      audio.pause();
    }
  }, [currentTrack?.id, currentTrack?.url, player.playing]);

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

      <CassetteToggle
        track={currentTrack}
        playing={!!player.playing}
        onToggle={() => setPlaying(p => !p)}
        onPrev={() => tracks.length && setCurrentTrack(currentIdx - 1)}
        onNext={() => tracks.length && setCurrentTrack(currentIdx + 1)}
      />
      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={() => {
          if (tracks.length > 1) setCurrentTrack(currentIdx + 1);
          else store?.update?.('player.playing', false);
        }}
      />

      {SECTIONS.map((s, i) => {
        const Comp = window[s.Comp];
        return (
          <section key={s.id} id={s.id} className="diary-page" data-page data-idx={i}
            data-screen-label={`${String(i+1).padStart(2,'0')} ${s.label}`}>
            <div className="diary-canvas">
              {Comp ? <Comp /> : <div style={{ padding: 80 }}>missing: {s.Comp}</div>}
              {window.ScrapbookElements && <window.ScrapbookElements pageId={s.id} />}
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
