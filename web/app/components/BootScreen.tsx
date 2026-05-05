"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { startMusic } from "../lib/audio";
import styles from "./BootScreen.module.css";

const AUTO_DISMISS_MS = 6000;

export function BootScreen() {
  const [phase, setPhase] = useState<"boot" | "fading" | "gone">("boot");

  useEffect(() => {
    const auto = setTimeout(() => dismiss(false), AUTO_DISMISS_MS);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key.length === 1) dismiss(true);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(auto);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismiss(userInitiated: boolean) {
    if (phase !== "boot") return;
    if (userInitiated) startMusic();
    setPhase("fading");
    setTimeout(() => setPhase("gone"), 450);
  }

  if (phase === "gone") return null;

  return (
    <div
      className={`${styles.overlay} ${phase === "fading" ? styles.fading : ""}`}
      onClick={() => dismiss(true)}
      role="button"
      tabIndex={0}
      aria-label="Press start to enter"
    >
      <div className={styles.scanline} aria-hidden="true" />
      <div className={styles.crt} aria-hidden="true" />
      <div className={styles.stack}>
        <div className={styles.logoSlot}>
          <Logo size={42} />
        </div>
        <div className={styles.sub}>EST. 2026</div>
        <div className={styles.start}>▶ PRESS START ◀</div>
      </div>
    </div>
  );
}
