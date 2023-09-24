'use client';
import styles from '@/styles/Components/Toggle.module.scss';

type ToggleProps = {
  value: boolean;
  onChange: () => void;
};

function Toggle({ value, onChange }: ToggleProps) {
  return (
    <div
      className={`${styles.toggle} ${value ? styles.active : ''}`}
      onClick={() => onChange()}
    >
      <div className={styles.middle}></div>
    </div>
  );
}

export { Toggle };
