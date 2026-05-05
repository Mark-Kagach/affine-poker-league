"use client";

import { useEffect, useState } from "react";
import { isMuted, subscribe, toggleMute } from "../lib/audio";
import styles from "./SoundToggle.module.css";

export function SoundToggle() {
  const [muted, setMuted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMuted(isMuted());
    setHydrated(true);
    const unsub = subscribe((m) => setMuted(m));
    return () => {
      unsub();
    };
  }, []);

  const handleClick = () => {
    setMuted(toggleMute());
  };

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={handleClick}
      aria-pressed={!muted}
      aria-label={muted ? "Unmute music" : "Mute music"}
      suppressHydrationWarning
    >
      {hydrated ? (muted ? "♪ MUSIC OFF" : "♪ MUSIC ON") : "♪ MUSIC ---"}
    </button>
  );
}
