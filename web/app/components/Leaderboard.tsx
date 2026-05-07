import { Logo } from "./Logo";
import { PixelCardRow } from "./Ornaments";
import { PlayerRow } from "./PlayerRow";
import type { RankedPlayer } from "../lib/types";
import { SHEETS_URL, TOKENS_URL } from "../lib/config";
import styles from "./Leaderboard.module.css";

type Props = {
  players: RankedPlayer[];
};

export function Leaderboard({ players }: Props) {
  return (
    <section className={styles.frame} aria-label="AFFINE Poker Club leaderboard">
      <PixelCardRow />

      <header className={styles.title}>
        <Logo size={26} />
      </header>

      <PixelCardRow />

      <div className={styles.tableHeader} aria-hidden="true">
        <span>RANK</span>
        <span>Δ</span>
        <span></span>
        <span>PLAYER</span>
        <span className={styles.headerRight}>SCORE</span>
        <span className={`${styles.headerRight} ${styles.headerMuted}`}>BOUGHT</span>
        <span className={`${styles.headerRight} ${styles.headerMuted}`}>FINAL</span>
        <span className={`${styles.headerRight} ${styles.headerMuted}`}>GAMES</span>
      </div>

      {players.length === 0 ? (
        <div className={styles.empty}>AWAITING FIRST PLAYER</div>
      ) : (
        <ol className={styles.list}>
          {players.map((player) => (
            <PlayerRow key={player.id} player={player} />
          ))}
        </ol>
      )}

      <div className={styles.actions}>
        <a
          className={styles.ledgerButton}
          href={SHEETS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          ▶ VIEW LEDGER ◀
        </a>
        <div className={styles.actionsHint}>FULL ACCOUNTING ON GOOGLE SHEETS</div>

        <a
          className={styles.tokensButton}
          href={TOKENS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          ▶ CONVERT YOUR SCORE TO CLAUDE TOKENS ◀
        </a>
      </div>

      <PixelCardRow />

      <footer className={styles.footer}>
        <span className={styles.blink}>INSERT COIN</span>
        <span className={styles.dot}>•</span>
        <span>EST. 2026</span>
      </footer>
    </section>
  );
}
