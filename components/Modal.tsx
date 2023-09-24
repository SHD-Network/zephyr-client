'use client';
import styles from '@/styles/components/Modal.module.scss';

type ModalProps = {
  children: React.ReactNode | React.ReactNode[];
  open: boolean;
  onToggle: (isOpen: boolean) => void;
};

function Modal({ children, open, onToggle }: ModalProps) {
  return (
    <div className={`${styles.modal} ${open ? styles.open : ''}`}>
      <div className={styles.backdrop} onClick={() => onToggle(false)} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}

export { Modal };
