// Simple inline SVG icons. Inline means no image files to load and they can
// inherit the colour of whatever they sit inside.

export const Bolt = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
)

export const MicIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="9" y="2" width="6" height="11" rx="3" fill="currentColor" stroke="none" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v4" />
  </svg>
)

export const NoteIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 18V5l10-2v13" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="6.5" cy="18" r="3" />
    <circle cx="16.5" cy="16" r="3" />
  </svg>
)

export const ChartIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v9l6.5 4" strokeLinecap="round" />
  </svg>
)

export const HomeIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
)

export const GearIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3.2" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" strokeLinecap="round" />
  </svg>
)

// --- Streaming platform marks (simplified, generic shapes) -----------------
export const SpotifyMark = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
    <path d="M5.5 8.5c4-1.4 9-1.1 13 1" />
    <path d="M6.5 12.4c3.3-1.1 7.4-.8 10.6.9" />
    <path d="M7.5 16.1c2.6-.8 5.8-.6 8.4.8" />
  </svg>
)

export const AppleMark = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff">
    <path d="M20 3 8 5.4v10.2a3.4 3.4 0 1 0 2 3.1V8.6l8-1.6v6.3a3.4 3.4 0 1 0 2 3.1z" />
  </svg>
)

export const YoutubeMark = () => (
  <svg width="30" height="22" viewBox="0 0 30 22">
    <rect x="2" y="2" width="26" height="18" rx="5" fill="#FF0033" />
    <path d="M12.5 7.5 19 11l-6.5 3.5z" fill="#fff" />
  </svg>
)

export const WaveMark = () => (
  <svg width="30" height="26" viewBox="0 0 30 26" fill="#fff">
    {[3, 7, 11, 15, 19, 23, 27].map((x, i) => {
      const h = [10, 18, 24, 14, 22, 12, 8][i]
      return <rect key={x} x={x - 1.4} y={13 - h / 2} width="2.8" height={h} rx="1.4" />
    })}
  </svg>
)

export const SignalIcon = () => (
  <svg width="18" height="12" viewBox="0 0 18 12" fill="#fff">
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5" y="5" width="3" height="7" rx="1" />
    <rect x="10" y="2.5" width="3" height="9.5" rx="1" opacity="0.4" />
    <rect x="15" y="0" width="3" height="12" rx="1" opacity="0.4" />
  </svg>
)

export const WifiIcon = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 3.6a11 11 0 0 1 14.5 0M3.8 6.6a7 7 0 0 1 9 0M6.6 9.5a3 3 0 0 1 3.4 0" />
  </svg>
)

export const BatteryIcon = () => (
  <svg width="26" height="13" viewBox="0 0 26 13">
    <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" fill="none" stroke="#ffffff66" />
    <rect x="2" y="2" width="14" height="9" rx="2" fill="#7fb84e" />
    <path d="M9 2.5 6 7h2.2l-.7 3.5L11 6H8.8z" fill="#22242a" />
    <rect x="24" y="4" width="2" height="5" rx="1" fill="#ffffff55" />
  </svg>
)
