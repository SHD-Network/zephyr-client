import styles from '@/styles/components/Window.module.scss';
import { ReactNode } from 'react';

type WindowProps = {
  children: ReactNode;
  outerBorder?: boolean;
  innerBorder?: boolean;
  blur?: boolean;
};

function Window({
  children,
  outerBorder = true,
  innerBorder = true,
}: WindowProps) {
  return (
    <div className={styles.window}>
      {outerBorder && <WindowBorders type="outer" />}

      {innerBorder && <WindowBorders type="inner" />}

      {children}
    </div>
  );
}

type WindowBordersProps = {
  type: 'inner' | 'outer';
};

function WindowBorders({ type }: WindowBordersProps) {
  return (
    <div
      className={`${styles.borders} ${
        type === 'inner' ? styles.inner : styles.outer
      }`}
    >
      <div className={styles.top}>
        <div className={styles.left} />
        <div className={styles.right} />
      </div>
      <div className={styles.bottom}>
        <div className={styles.left} />
        <div className={styles.right} />
      </div>
    </div>
  );
}

export { Window };
