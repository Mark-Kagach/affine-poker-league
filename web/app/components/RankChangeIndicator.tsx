import styles from "./RankChangeIndicator.module.css";

type Props = {
  delta: number;
};

export function RankChangeIndicator({ delta }: Props) {
  if (delta === 0) {
    return (
      <span className={`${styles.indicator} ${styles.flat}`} aria-label="no change">
        —
      </span>
    );
  }
  if (delta > 0) {
    return (
      <span className={`${styles.indicator} ${styles.up}`} aria-label={`up ${delta}`}>
        ▲{delta}
      </span>
    );
  }
  return (
    <span className={`${styles.indicator} ${styles.down}`} aria-label={`down ${-delta}`}>
      ▼{-delta}
    </span>
  );
}
