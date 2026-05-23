// Auth — sign in with email + password (the 3 accounts you create
// in Supabase). When no Supabase is configured, treats viewer as
// "local editor" so the preview just works.

const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState(null);
  const sbRef = React.useRef(null);

  React.useEffect(() => {
    const sb = window.getSupabase();
    if (!sb) {
      // local mode — fabricate a signed-in editor so the diary is usable.
      setUser({ email: 'local@local', local: true, profile: { name: 'You (local)', color: '#1c1612' } });
      setReady(true);
      return;
    }
    sbRef.current = sb;
    sb.auth.getSession().then(({ data }) => {
      setUser(decorate(data.session?.user || null));
      setReady(true);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setUser(decorate(session?.user || null));
    });
    return () => sub.subscription?.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    if (!sbRef.current) return { error: { message: 'No backend configured.' } };
    setError(null);
    const { error } = await sbRef.current.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    return { error };
  };
  const signOut = async () => {
    if (!sbRef.current) return;
    await sbRef.current.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signOut, error, hasBackend: !!sbRef.current }}>
      {children}
    </AuthContext.Provider>
  );
}

function decorate(user) {
  if (!user) return null;
  const editors = window.DIARY_CONFIG?.EDITORS || {};
  const profile = editors[user.email] || { name: user.email.split('@')[0], color: '#1c1612' };
  return { ...user, profile };
}

const useAuth = () => React.useContext(AuthContext);

// ─── Sign-in modal ────────────────────────────────────────────
function SignInModal({ onClose }) {
  const { signIn, error, hasBackend } = useAuth();
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const { error: err } = await signIn(email, pw);
    setBusy(false);
    if (!err) onClose?.();
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(28,22,18,.55)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit}
        style={{
          background: '#f3e8cf', padding: '28px 32px', width: 360,
          boxShadow: '0 16px 40px rgba(0,0,0,.3), 6px 6px 0 #d44a35',
          fontFamily: 'IBM Plex Mono, monospace', color: '#1c1612'
        }}>
        <div style={{ fontFamily: 'Caveat, cursive', fontSize: 40, lineHeight: 1, color: '#1c1612', marginBottom: 4 }}>
          sign in to edit
        </div>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: '#7a4a2a', marginBottom: 18 }}>
          one of the three of us · 우리 셋 중 한 사람
        </div>
        {!hasBackend && (
          <div style={{
            padding: 10, background: '#fbd9c9', fontSize: 11, lineHeight: 1.4,
            marginBottom: 14, border: '1px dashed #d44a35'
          }}>
            No Supabase configured. Anyone viewing can edit locally; nothing syncs.
            See SETUP.md to enable sharing.
          </div>
        )}
        <label style={{ display: 'block', fontSize: 10, letterSpacing: '.16em' }}>EMAIL</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)}
          autoFocus required disabled={!hasBackend}
          style={inputStyle} />
        <label style={{ display: 'block', fontSize: 10, letterSpacing: '.16em', marginTop: 14 }}>PASSWORD</label>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}
          required disabled={!hasBackend}
          style={inputStyle} />
        {error && <div style={{ marginTop: 12, fontSize: 11, color: '#d44a35' }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
          <button type="button" onClick={onClose} style={{ ...btnStyle, background: 'transparent', color: '#1c1612', border: '1.5px solid #1c1612' }}>
            CANCEL
          </button>
          <button type="submit" disabled={busy || !hasBackend} style={{ ...btnStyle, flex: 1 }}>
            {busy ? '...' : 'SIGN IN ↵'}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'transparent', border: 'none',
  borderBottom: '1.5px solid #1c1612',
  padding: '6px 2px', fontFamily: 'inherit', fontSize: 14,
  outline: 'none', color: 'inherit', marginTop: 4
};
const btnStyle = {
  padding: '10px 14px', fontFamily: 'inherit',
  fontSize: 11, letterSpacing: '.18em',
  background: '#d44a35', color: '#f3e8cf', border: 'none',
  cursor: 'pointer'
};

Object.assign(window, { AuthProvider, useAuth, SignInModal });
