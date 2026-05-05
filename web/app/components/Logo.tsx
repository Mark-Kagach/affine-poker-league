import styles from "./Logo.module.css";

type Props = {
  /** Height of a single chip in pixels (the unit the rest of the logo scales from). */
  size?: number;
};

const PALETTE = {
  gold:    { body: "#ffcf3d", light: "#fff5c8", dark: "#a8810a" },
  cyan:    { body: "#3df2ff", light: "#c8faff", dark: "#11808a" },
  magenta: { body: "#ff3df2", light: "#ffc8fa", dark: "#8a118a" },
};

// Pixel club crest:
//   - LEFT:  three poker chips stacked (gold / cyan / magenta), 1px gap between
//   - RIGHT: three lines of text, each aligned with its matching chip:
//              [gold A] FFINE
//              [cyan P] oker
//              [mag. C] lub
export function Logo({ size = 36 }: Props) {
  return (
    <div
      className={styles.logo}
      style={{ ["--logo-unit" as string]: `${size}px` }}
    >
      <div className={styles.chipColumn}>
        <ChipBox palette={PALETTE.gold} />
        <ChipBox palette={PALETTE.cyan} />
        <ChipBox palette={PALETTE.magenta} />
      </div>
      <div className={styles.wordColumn}>
        <div className={styles.line}>
          <span className={`${styles.accent} ${styles.gold}`}>A</span>
          <span className={styles.rest}>FFINE</span>
        </div>
        <div className={styles.line}>
          <span className={`${styles.accent} ${styles.cyan}`}>P</span>
          <span className={styles.rest}>oker</span>
        </div>
        <div className={styles.line}>
          <span className={`${styles.accent} ${styles.magenta}`}>C</span>
          <span className={styles.rest}>lub</span>
        </div>
      </div>
    </div>
  );
}

function ChipBox({
  palette,
}: {
  palette: { body: string; light: string; dark: string };
}) {
  const { body, light, dark } = palette;
  return (
    <svg
      className={styles.chip}
      viewBox="0 0 28 8"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <rect x={2} y={0} width={24} height={1} fill={body} />
      {[5, 11, 17, 23].map((x) => (
        <rect key={`t${x}`} x={x} y={0} width={2} height={1} fill="#ffffff" />
      ))}
      <rect x={1} y={1} width={26} height={1} fill={light} />
      <rect x={0} y={2} width={28} height={4} fill={body} />
      <rect x={11} y={3} width={6} height={2} fill="#ffffff" />
      <rect x={1} y={6} width={26} height={1} fill={dark} />
      <rect x={2} y={7} width={24} height={1} fill={body} />
      {[5, 11, 17, 23].map((x) => (
        <rect key={`b${x}`} x={x} y={7} width={2} height={1} fill="#ffffff" />
      ))}
    </svg>
  );
}
