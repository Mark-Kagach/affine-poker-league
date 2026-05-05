// Singleton background-music controller. Boot screen, sound toggle, and the
// page-level autoplay attempt all share one HTMLAudioElement.
//
// Autoplay strategy (since browsers block unmuted autoplay without a gesture):
//   1. On page load, try to .play() unmuted.
//   2. If that's blocked, .play() MUTED instead — most browsers allow this,
//      so the loop is already running silently in the background.
//   3. On the first user gesture (anywhere on the page), unmute. Audio
//      becomes audible immediately at the current playback position, with
//      no perceptible "loading" delay.
//   4. If the user has explicitly muted via the corner toggle, all of the
//      above still respects that preference.

const STORAGE_KEY = "apc.sound.muted";
const SRC = "/theme.mp3";

let audio: HTMLAudioElement | null = null;
let gestureBound = false;
const listeners = new Set<(muted: boolean) => void>();

function ensureAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.32;
  }
  return audio;
}

export function isMuted(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function emit(muted: boolean) {
  for (const l of listeners) l(muted);
}

async function tryPlay(): Promise<void> {
  const a = ensureAudio();
  if (!a) return;
  const userMuted = isMuted();

  if (userMuted) {
    a.muted = true;
    try {
      await a.play();
    } catch {
      // ignore — will start when user toggles
    }
    return;
  }

  a.muted = false;
  try {
    await a.play();
    return;
  } catch {
    // Unmuted autoplay blocked by browser. Fall back to muted autoplay so the
    // loop is "running" silently and we can flip a.muted = false on the first
    // user gesture for instant audible playback.
    a.muted = true;
    try {
      await a.play();
    } catch {
      // ignore — first gesture will retry from scratch
    }
  }
}

export function attemptAutoplay(): void {
  if (typeof window === "undefined") return;
  void tryPlay();
  if (gestureBound) return;
  gestureBound = true;
  const onGesture = () => {
    const a = ensureAudio();
    if (!a) return;
    if (!isMuted()) {
      a.muted = false;
      if (a.paused) a.play().catch(() => {});
    }
    window.removeEventListener("pointerdown", onGesture);
    window.removeEventListener("keydown", onGesture);
    window.removeEventListener("touchstart", onGesture);
  };
  window.addEventListener("pointerdown", onGesture);
  window.addEventListener("keydown", onGesture);
  window.addEventListener("touchstart", onGesture);
}

export function startMusic(): void {
  void tryPlay();
  emit(isMuted());
}

export function toggleMute(): boolean {
  const a = ensureAudio();
  const newMuted = !isMuted();
  window.localStorage.setItem(STORAGE_KEY, String(newMuted));
  if (a) {
    a.muted = newMuted;
    if (!newMuted && a.paused) {
      a.play().catch(() => {});
    }
  }
  emit(newMuted);
  return newMuted;
}

export function subscribe(listener: (muted: boolean) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
