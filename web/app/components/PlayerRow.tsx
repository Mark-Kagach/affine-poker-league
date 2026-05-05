import { PortraitPlaceholder } from "./PortraitPlaceholder";
import { RankChangeIndicator } from "./RankChangeIndicator";
import type { RankedPlayer } from "../lib/types";
import styles from "./PlayerRow.module.css";

type Props = {
  player: RankedPlayer;
};

const fmt = (n: number) => n.toLocaleString("en-US");
const fmtSigned = (n: number) => (n > 0 ? `+${fmt(n)}` : fmt(n));

const TIER_PREFIX: Record<number, string> = {
  1: "★",
  2: "✦",
  3: "✦",
};

function tierClass(rank: number) {
  if (rank === 1) return styles.champion;
  if (rank === 2) return styles.silver;
  if (rank === 3) return styles.bronze;
  return "";
}

export function PlayerRow({ player }: Props) {
  const rankLabel = String(player.rank).padStart(2, "0");
  const scoreClass = player.score < 0 ? styles.scoreNeg : styles.scorePos;
  const prefix = TIER_PREFIX[player.rank];

  return (
    <li
      className={`${styles.row} ${tierClass(player.rank)}`}
      data-rank={player.rank}
    >
      <span className={styles.rank}>
        {prefix && <span className={styles.medal}>{prefix}</span>}
        {rankLabel}
      </span>
      <span className={styles.delta}>
        <RankChangeIndicator delta={player.rankDelta} />
      </span>
      <span className={styles.portraitCell}>
        <PortraitPlaceholder
          name={player.name}
          accent={player.accent}
          portrait={player.portrait}
        />
      </span>
      <span className={styles.nameCell}>
        <span className={styles.name}>{player.name}</span>
      </span>
      <span className={`${styles.score} ${scoreClass}`}>
        {fmtSigned(player.score)}
      </span>
      <span className={styles.muted} title="Total chips bought in">
        {fmt(player.boughtChips)}
      </span>
      <span className={styles.muted} title="Final chip stack">
        {fmt(player.finalChips)}
      </span>
      <span className={styles.muted}>{player.gamesPlayed}</span>
    </li>
  );
}
