'use client';
import styles from '@/styles/components/Button.module.scss';

type ButtonProps = {
  label?: string;
  icon?: JSX.Element;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  pending?: boolean;
};

function Button({ label, icon, iconPosition, onClick }: ButtonProps) {
  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (onClick) {
      onClick();
    }
  }

  return (
    <button
      className={`${styles.button} ${
        iconPosition === 'left' ? styles.left : styles.right
      }`}
      onClick={handleClick}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

export { Button };
