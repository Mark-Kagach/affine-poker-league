import styles from "./PortraitPlaceholder.module.css";

type Props = {
  name: string;
  accent: string;
  portrait: string | null;
};

export function PortraitPlaceholder({ name, accent, portrait }: Props) {
  return (
    <div
      className={styles.portrait}
      style={{ ["--portrait-accent" as string]: accent }}
    >
      {portrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={portrait}
          alt={`${name} portrait`}
          className={styles.image}
          draggable={false}
        />
      ) : (
        <span className={styles.initial} aria-hidden="true">
          {name.trim().charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}
