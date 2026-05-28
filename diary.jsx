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

function MobileSection({ id, no, title, kr, children }) {
  return (
    <section id={id} className="mobile-section">
      <div className="mobile-section-kicker">{String(no).padStart(2, '0')} · {kr}</div>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function MobilePhotoCard({ photo }) {
  const caption = photo.caption || photo.slot || photo.name || 'photo';
  const kr = photo.captionKr || photo.kr || '';
  return (
    <figure className="mobile-polaroid" style={{ '--rot': `${photo.rot || 0}deg` }}>
      {photo.imageUrl ? (
        <img src={photo.imageUrl} alt={caption} />
      ) : (
        <div className="mobile-photo-empty" data-slot={photo.slot || caption} />
      )}
      <figcaption>
        <span>{caption}</span>
        {kr && <small>{kr}</small>}
      </figcaption>
    </figure>
  );
}

function MobilePlayer({ track, playing, onToggle, onPrev, onNext }) {
  return (
    <div className={`mobile-player${playing ? ' playing' : ''}`}>
      <button type="button" onClick={onToggle}>{playing ? 'PAUSE' : 'PLAY'}</button>
      <div>
        <strong>{track?.t || 'our songs'}</strong>
        <span>{track?.a || 'mixtape'}</span>
      </div>
      <button type="button" onClick={onPrev}>PREV</button>
      <button type="button" onClick={onNext}>NEXT</button>
    </div>
  );
}

function MobileDiary({ content, currentTrack, playing, onTogglePlayer, onPrevTrack, onNextTrack, onSelectTrack }) {
  const c = content || window.DIARY_DEFAULTS || {};
  const cover = c.cover || {};
  const photos = [...(cover.polaroids || []), ...(c.photos || [])];
  const food = c.food || [];
  const pins = c.mapPins || [];
  const months = c.timelineMonths || [];
  const tracks = c.playlist || [];
  const jokes = c.jokes || [];
  const letters = c.letters || [];
  const signs = c.guestbook || [];

  return (
    <main className="mobile-diary">
      <section className="mobile-hero">
        <div className="mobile-hero-kicker">{cover.kicker || 'A SCRAPBOOK'}</div>
        <h1>{cover.titleA} <span>{cover.titleB}</span> {cover.titleC}</h1>
        <p className="mobile-kr">{cover.subtitleKr}</p>
        <p>{cover.subtitleEn}</p>
        <div className="mobile-date">{cover.dateRange}</div>
        <div className="mobile-cover-strip">
          {(cover.polaroids || []).slice(0, 2).map((p, i) => (
            <MobilePhotoCard key={p.id || i} photo={p} />
          ))}
        </div>
      </section>

      <nav className="mobile-nav" aria-label="Mobile sections">
        {[
          ['m-photos', 'Photos'],
          ['m-food', 'Food'],
          ['m-map', 'Map'],
          ['m-timeline', 'Timeline'],
          ['m-playlist', 'Mixtape'],
          ['m-jokes', 'Jokes'],
          ['m-letters', 'Letters'],
          ['m-guestbook', 'Guestbook'],
        ].map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>

      <MobileSection id="m-photos" no="02" title="the photo wall" kr="사진">
        <div className="mobile-photo-grid">
          {photos.map((p, i) => <MobilePhotoCard key={p.id || i} photo={p} />)}
        </div>
      </MobileSection>

      <MobileSection id="m-food" no="03" title="what we ate" kr="음식">
        <div className="mobile-card-list">
          {food.map((dish) => (
            <article key={dish.id} className="mobile-food-card">
              {dish.imageUrl ? <img src={dish.imageUrl} alt={dish.name} /> : <div className="mobile-food-empty" />}
              <div>
                <h3>{dish.name} <span>{dish.kr}</span></h3>
                <p>{dish.place}</p>
                <p>{'★'.repeat(Number(dish.rating) || 0)}</p>
                <small>{dish.note}</small>
              </div>
            </article>
          ))}
        </div>
      </MobileSection>

      <MobileSection id="m-map" no="04" title="our melbourne map" kr="지도">
        <ol className="mobile-map-list">
          {pins.map((pin) => (
            <li key={pin.id}>
              <strong>{pin.n || ''} {pin.name}</strong>
              <span>{pin.kr} · {pin.place}</span>
            </li>
          ))}
        </ol>
      </MobileSection>

      <MobileSection id="m-timeline" no="05" title="months together" kr="시간">
        <div className="mobile-timeline">
          {months.map((month) => {
            const monthPhotos = Array.isArray(month.photos)
              ? month.photos
              : [{ id: `${month.id}-photo`, slot: month.pol, caption: month.pol, imageUrl: month.imageUrl, rot: -3 }];
            const monthDays = Array.isArray(month.days) ? month.days : [];

            return (
              <article key={month.id} style={{ borderColor: month.accent || '#d44a35' }}>
                <div>{month.en} · {month.kr}</div>
                <h3>{month.big}</h3>
                <p>{month.note}</p>
                {!!monthPhotos.length && (
                  <div className="mobile-month-photos">
                    {monthPhotos.slice(0, 2).map((photo, i) => (
                      <MobilePhotoCard key={photo.id || i} photo={{ ...photo, caption: photo.caption || photo.slot }} />
                    ))}
                  </div>
                )}
                {!!monthDays.length && (
                  <div className="mobile-day-strip">
                    {monthDays.slice(0, 4).map((day) => (
                      <span key={day.id} style={{ borderColor: month.accent || '#d44a35' }}>
                        {day.day} · {day.title}
                      </span>
                    ))}
                  </div>
                )}
                <small>{month.pol}</small>
              </article>
            );
          })}
        </div>
      </MobileSection>

      <MobileSection id="m-playlist" no="06" title="our mixtape" kr="노래">
        <div className="mobile-track-list">
          {tracks.map((track) => (
            <button key={track.id} type="button" className={track.id === currentTrack?.id ? 'active' : ''}
              onClick={() => onSelectTrack?.(track)}>
              <span>{track.n}</span>
              <strong>{track.t}</strong>
              <em>{track.a}</em>
              <small>{track.note}{track.url ? ' · audio' : ''}</small>
            </button>
          ))}
        </div>
      </MobileSection>

      <MobileSection id="m-jokes" no="07" title="inside jokes" kr="농담">
        <div className="mobile-note-grid">
          {jokes.map((joke) => (
            <article key={joke.id} style={{ background: joke.bg || '#fef4a8', '--rot': `${joke.rot || 0}deg` }}>
              <p>{joke.text}</p>
              <small>- {joke.who}</small>
            </article>
          ))}
        </div>
      </MobileSection>

      <MobileSection id="m-letters" no="08" title="letters to keep" kr="편지">
        <div className="mobile-letter-list">
          {letters.map((letter) => (
            <article key={letter.id} style={{ background: letter.bg || '#fef4d4', borderColor: letter.accent || '#d44a35' }}>
              <h3>{letter.from}</h3>
              <small>to {letter.to}</small>
              {(letter.body || []).map((line, i) => <p key={i}>{line}</p>)}
              <footer>- {letter.sign} · {letter.date}</footer>
            </article>
          ))}
        </div>
      </MobileSection>

      <MobileSection id="m-guestbook" no="09" title="guestbook" kr="방명록">
        <div className="mobile-guestbook">
          {signs.map((sign) => (
            <article key={sign.id} style={{ color: sign.color || '#213e6c' }}>
              <p>{sign.msg}</p>
              <small>- {sign.name}</small>
            </article>
          ))}
        </div>
      </MobileSection>

      <MobilePlayer
        track={currentTrack}
        playing={playing}
        onToggle={onTogglePlayer}
        onPrev={onPrevTrack}
        onNext={onNextTrack}
      />
    </main>
  );
}

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
  const selectTrack = (track) => {
    if (track?.id) store?.update?.('player.currentTrackId', track.id);
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
      <div className="desktop-diary">
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
      </div>

      <MobileDiary
        content={store?.content || window.DIARY_DEFAULTS}
        currentTrack={currentTrack}
        playing={!!player.playing}
        onTogglePlayer={() => setPlaying(p => !p)}
        onPrevTrack={() => tracks.length && setCurrentTrack(currentIdx - 1)}
        onNextTrack={() => tracks.length && setCurrentTrack(currentIdx + 1)}
        onSelectTrack={selectTrack}
      />

      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={() => {
          if (tracks.length > 1) setCurrentTrack(currentIdx + 1);
          else store?.update?.('player.playing', false);
        }}
      />
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
