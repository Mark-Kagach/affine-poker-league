import styles from "./Ornaments.module.css";

// Pixel-art mini playing cards across the leaderboard frame. Replaces the
// marquee bulb lights for a more on-theme casino-arcade vibe.
const CARD_PATTERN = [
  { value: "A", suit: "♠", tone: "cyan" },
  { value: "K", suit: "♥", tone: "magenta" },
  { value: "Q", suit: "♦", tone: "magenta" },
  { value: "J", suit: "♣", tone: "cyan" },
  { value: "10", suit: "♠", tone: "cyan" },
  { value: "A", suit: "♥", tone: "magenta" },
  { value: "K", suit: "♦", tone: "magenta" },
  { value: "Q", suit: "♣", tone: "cyan" },
] as const;

export function PixelCardRow() {
  return (
    <div className={styles.cardRow} aria-hidden="true">
      {CARD_PATTERN.map((c, i) => (
        <div
          key={i}
          className={`${styles.card} ${styles[c.tone]}`}
          style={{ animationDelay: `${i * 220}ms` }}
        >
          <span className={styles.cardValue}>{c.value}</span>
          <span className={styles.cardSuit}>{c.suit}</span>
        </div>
      ))}
    </div>
  );
}

// Card suits in the four corners of the viewport.
export function CornerSuits() {
  return (
    <div aria-hidden="true">
      <span className={`${styles.suit} ${styles.tl}`}>♠</span>
      <span className={`${styles.suit} ${styles.tr}`}>♥</span>
      <span className={`${styles.suit} ${styles.bl}`}>♦</span>
      <span className={`${styles.suit} ${styles.br}`}>♣</span>
    </div>
  );
}

// Synthwave perspective grid floor at the bottom of the page.
export function GridFloor() {
  return (
    <div className={styles.gridFloor} aria-hidden="true">
      <div className={styles.gridSurface} />
      <div className={styles.gridFade} />
    </div>
  );
}
