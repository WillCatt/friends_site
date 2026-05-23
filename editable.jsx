// Edit mode + editable primitives.
// Editing is gated on "signed-in editor". When edit mode is off, these
// components render exactly like static text/images.

const EditModeContext = React.createContext({ editMode: false, setEditMode: () => {} });

function EditModeProvider({ children }) {
  const [editMode, setEditMode] = React.useState(false);
  return (
    <EditModeContext.Provider value={{ editMode, setEditMode }}>
      {children}
    </EditModeContext.Provider>
  );
}
const useEditMode = () => React.useContext(EditModeContext);

// ─── EditableText ─────────────────────────────────────────────
// Wraps any text. In edit mode it becomes contentEditable; saves to
// the store on blur or Enter. Pass path="photos[id].caption" or any
// store-path string + an `onChange(value)` callback to persist.
function EditableText({ value, onChange, multiline = false, tag = 'span', className, style, placeholder = '...' }) {
  const { editMode } = useEditMode();
  const { user } = useAuth();
  const ref = React.useRef(null);
  const Tag = tag;

  const editable = editMode && !!user;

  const commit = () => {
    if (!ref.current) return;
    const v = multiline
      ? ref.current.innerText
      : ref.current.textContent;
    if (v !== value) onChange?.(v);
  };

  if (!editable) {
    return <Tag className={className} style={style}>{value || ''}</Tag>;
  }

  return (
    <Tag ref={ref} className={(className || '') + ' editable-text'} style={style}
      contentEditable suppressContentEditableWarning
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onBlur={commit}
      onKeyDown={(e) => {
        if (!multiline && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); }
        if (e.key === 'Escape') { e.currentTarget.textContent = value; e.currentTarget.blur(); }
      }}
      data-placeholder={placeholder}>
      {value}
    </Tag>
  );
}

// ─── EditableImage ────────────────────────────────────────────
// Drop-zone for photo slots. When edit mode is on, drag an image
// file onto it to upload + replace. Shows the current image with
// hover delete in edit mode.
function EditableImage({ src, slot, onChange, style, className }) {
  const { editMode } = useEditMode();
  const { user } = useAuth();
  const { uploadImage } = useStore();
  const [busy, setBusy] = React.useState(false);
  const [over, setOver] = React.useState(false);
  const fileRef = React.useRef(null);

  const editable = editMode && !!user;

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange?.(url);
    } catch (e) {
      console.error('upload failed', e);
      alert('Upload failed: ' + (e?.message || e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={className}
      style={{ ...style, position: 'relative', overflow: 'hidden', cursor: editable ? 'pointer' : 'default' }}
      onClick={(e) => { if (editable) { e.stopPropagation(); fileRef.current?.click(); } }}
      onDragOver={editable ? (e) => { e.preventDefault(); setOver(true); } : undefined}
      onDragLeave={editable ? () => setOver(false) : undefined}
      onDrop={editable ? (e) => {
        e.preventDefault(); setOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      } : undefined}>
      {src ? (
        <img src={src} alt={slot || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
      ) : (
        <div className="photo-slot" data-slot={slot} style={{ width: '100%', height: '100%' }} />
      )}

      {/* Edit overlay */}
      {editable && (
        <div style={{
          position: 'absolute', inset: 0,
          background: over ? 'rgba(212,74,53,.35)' : busy ? 'rgba(0,0,0,.5)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: 10, letterSpacing: '.16em',
          pointerEvents: 'none', transition: 'background .15s'
        }}>
          {busy ? 'UPLOADING…' : over ? 'DROP TO REPLACE' : null}
        </div>
      )}

      {/* Hover hint when not actively over */}
      {editable && !busy && !over && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(28,22,18,.55), transparent)',
          color: '#fff', fontFamily: 'IBM Plex Mono', fontSize: 9, letterSpacing: '.16em',
          padding: '14px 8px 6px', textAlign: 'center', opacity: 0,
          transition: 'opacity .15s', pointerEvents: 'none'
        }} className="edit-hint">
          DROP IMAGE · 사진 드롭
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}

// ─── ColorSwatch (for jokes / guestbook) ──────────────────────
const SWATCHES = ['#fef4a8', '#fbd9c9', '#dff0d6', '#cde0f2'];
function ColorSwatch({ value, onChange }) {
  const { editMode } = useEditMode();
  const { user } = useAuth();
  if (!editMode || !user) return null;
  return (
    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
      {SWATCHES.map(s => (
        <button key={s} onClick={(e) => { e.stopPropagation(); onChange?.(s); }}
          style={{
            width: 14, height: 14, borderRadius: '50%',
            background: s, border: value === s ? '2px solid #1c1612' : '1px solid rgba(0,0,0,.2)',
            padding: 0, cursor: 'pointer'
          }} />
      ))}
    </div>
  );
}

// ─── Add / Delete buttons ─────────────────────────────────────
function AddButton({ onClick, label = '+ add', style }) {
  const { editMode } = useEditMode();
  const { user } = useAuth();
  if (!editMode || !user) return null;
  return (
    <button onClick={onClick} className="diary-edit-btn"
      style={{
        background: '#1c1612', color: '#f3e8cf', border: 'none',
        padding: '6px 12px', fontFamily: 'IBM Plex Mono, monospace',
        fontSize: 10, letterSpacing: '.18em', cursor: 'pointer',
        boxShadow: '3px 3px 0 #d44a35', ...style
      }}>
      {label}
    </button>
  );
}

function DeleteButton({ onClick, style }) {
  const { editMode } = useEditMode();
  const { user } = useAuth();
  if (!editMode || !user) return null;
  return (
    <button onClick={(e) => { e.stopPropagation(); onClick?.(); }}
      title="delete"
      style={{
        background: '#d44a35', color: '#f3e8cf', border: 'none',
        width: 22, height: 22, borderRadius: '50%',
        fontFamily: 'IBM Plex Mono', fontSize: 11, cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,.2)', lineHeight: 1, padding: 0,
        ...style
      }}>×</button>
  );
}

// ─── Edit-mode chrome (top bar pill + sign-in) ────────────────
function EditChrome({ onSignInClick }) {
  const { editMode, setEditMode } = useEditMode();
  const auth = useAuth();
  const store = useStore();
  const user = auth?.user;
  const signOut = auth?.signOut;
  const hasBackend = !!auth?.hasBackend;
  const synced = store?.synced || 'local';

  return (
    <div className="edit-chrome">
      <div className="sync-pill" data-status={synced}>
        <span className="sync-dot" />
        {synced === 'cloud' ? 'SYNCED' :
         synced === 'syncing' ? 'SAVING…' :
         synced === 'error' ? 'OFFLINE' :
         hasBackend ? '…' : 'LOCAL'}
      </div>

      {user ? (
        <React.Fragment>
          <button onClick={() => setEditMode(v => !v)} className={`edit-toggle${editMode ? ' on' : ''}`}>
            {editMode ? 'DONE EDITING' : 'EDIT'}
          </button>
          <button onClick={() => signOut?.()} className="signout-btn" title="sign out">
            {user.profile?.name || user.email}  ⏻
          </button>
        </React.Fragment>
      ) : (
        <button onClick={onSignInClick} className="edit-toggle">SIGN IN TO EDIT</button>
      )}
    </div>
  );
}

Object.assign(window, {
  EditModeProvider, useEditMode,
  EditableText, EditableImage,
  ColorSwatch, AddButton, DeleteButton,
  EditChrome
});
