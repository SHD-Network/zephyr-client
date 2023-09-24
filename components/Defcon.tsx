import styles from '@/styles/Components/Defcon.module.scss';

type DefconProps = {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  size: number;
  label: string;
  showLabel?: boolean;
  showLevel?: boolean;
};

function Defcon({
  level,
  size,
  label,
  showLabel = true,
  showLevel = true,
}: DefconProps) {
  const levelStyle =
    level === 1
      ? styles.white
      : level === 2
      ? styles.red
      : level === 3
      ? styles.yellow
      : level === 4
      ? styles.green
      : level === 5
      ? styles.blue
      : '';

  if (level === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.outerRing} ${levelStyle}`}
      style={{
        height: `${size}px`,
        width: `${size}px`,
        fontSize: `${size / 12}px`,
      }}
    >
      <div className={styles.innerCircle}>
        <div className={styles.gradient} />
        <div className={styles.dot} />
      </div>
      {showLevel && <span className={styles.level}>{level}</span>}
      {showLabel && <div className={styles.label}>{label}</div>}
    </div>
  );
}

export { Defcon };
