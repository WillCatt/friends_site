// Tiny shared icon / sticker primitives. Kept geometrically simple — these
// are scrapbook-stickers, not illustrations. Drop real assets in later.

const Icons = {
  // Simple elongated leaf (gum leaf abstraction)
  GumLeaf: ({ size = 22, color = '#6b7a4a' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 20 C 6 8, 14 4, 22 4 C 22 12, 18 20, 6 22 Z" fill={color}/>
      <path d="M5 21 L 20 6" stroke="#f3e8cf" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),

  // Simple pouch (bokjumeoni abstraction) — small bag with knot
  Pouch: ({ size = 22, color = '#d44a35' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="7" y="3" width="10" height="2" rx="1" fill={color}/>
      <path d="M5 9 C 5 6, 19 6, 19 9 L 21 20 C 21 22, 3 22, 3 20 Z" fill={color}/>
      <circle cx="12" cy="14" r="1.6" fill="#f3e8cf"/>
    </svg>
  ),

  // Cup of coffee — flat side view
  Cup: ({ size = 22, color = '#221d16' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 7 H 18 V 16 C 18 19, 16 21, 11 21 C 6 21, 4 19, 4 16 Z" fill={color}/>
      <path d="M18 9 C 22 9, 22 15, 18 15" stroke={color} strokeWidth="1.6" fill="none"/>
      <path d="M8 3 Q 9 5, 8 7" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M12 3 Q 13 5, 12 7" stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // Magpie-ish bird (simple oval + beak + tail)
  Magpie: ({ size = 24, color = '#1c1612' }) => (
    <svg width={size} height={size} viewBox="0 0 28 24" fill="none">
      <ellipse cx="13" cy="13" rx="9" ry="6" fill={color}/>
      <ellipse cx="13" cy="11" rx="6" ry="3.5" fill="#fff"/>
      <circle cx="20" cy="10" r="3.5" fill={color}/>
      <circle cx="21" cy="9.5" r=".8" fill="#fff"/>
      <path d="M23 9 L 27 8 L 24 11 Z" fill="#e6b840"/>
      <path d="M3 13 L 0 17 L 5 15 Z" fill={color}/>
    </svg>
  ),

  // Tram (Melbourne)
  Tram: ({ size = 28, color = '#d44a35' }) => (
    <svg width={size} height={size} viewBox="0 0 32 24" fill="none">
      <rect x="3" y="6" width="26" height="12" rx="3" fill={color}/>
      <rect x="6" y="9" width="4" height="4" fill="#f3e8cf"/>
      <rect x="12" y="9" width="4" height="4" fill="#f3e8cf"/>
      <rect x="18" y="9" width="4" height="4" fill="#f3e8cf"/>
      <rect x="24" y="9" width="3" height="4" fill="#f3e8cf"/>
      <circle cx="9" cy="20" r="2" fill="#1c1612"/>
      <circle cx="23" cy="20" r="2" fill="#1c1612"/>
      <path d="M16 6 L 16 2" stroke={color} strokeWidth="1.4"/>
    </svg>
  ),

  // Star (for stickers)
  Star: ({ size = 18, color = '#d39836' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18 21 L12 16.5 L6 21 L8 13.5 L2 9 L9.5 9 Z"/>
    </svg>
  ),

  // Pin/map marker
  Pin: ({ size = 20, color = '#d44a35' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2 C 7 2, 4 5, 4 10 C 4 16, 12 22, 12 22 C 12 22, 20 16, 20 10 C 20 5, 17 2, 12 2 Z" fill={color}/>
      <circle cx="12" cy="10" r="3" fill="#f3e8cf"/>
    </svg>
  ),

  // Music note
  Note: ({ size = 18, color = '#213e6c' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M9 3 L 20 1 L 20 16 C 20 18, 18 19, 16 19 C 14 19, 12 18, 12 16 C 12 14, 14 13, 16 13 C 17 13, 18 13.3, 18 13.3 L 18 6 L 11 7.5 L 11 19 C 11 21, 9 22, 7 22 C 5 22, 3 21, 3 19 C 3 17, 5 16, 7 16 C 8 16, 9 16.3, 9 16.3 Z"/>
    </svg>
  ),

  // Simple heart
  Heart: ({ size = 18, color = '#d44a35' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 21 C 12 21, 3 14, 3 8 C 3 5, 5 3, 8 3 C 10 3, 12 5, 12 5 C 12 5, 14 3, 16 3 C 19 3, 21 5, 21 8 C 21 14, 12 21, 12 21 Z"/>
    </svg>
  ),
};

window.Icons = Icons;
