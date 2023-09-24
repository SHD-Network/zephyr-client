'use client';
import styles from '@/styles/Pages/AccountSettings.module.scss';

type SettingProps = {
  children: React.ReactNode;
  title: string;
};

function Setting({ children, title }: SettingProps) {
  return (
    <div className={styles.setting}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Setting;
