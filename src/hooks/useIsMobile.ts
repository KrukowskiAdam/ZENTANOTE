import { useSyncExternalStore } from 'react';

// Phones only (either orientation): touch-first pointer and a short side under 540px.
// Tablets and desktops keep the full layout.
const MOBILE_QUERY = '(pointer: coarse) and (max-height: 540px), (pointer: coarse) and (max-width: 540px)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
