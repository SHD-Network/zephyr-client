'use client';

import styles from '@/styles/Layouts/SettingsLayout.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SettingsLayoutProps = {
  children: React.ReactNode;
};

function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  return (
    <div className={styles.settingsLayout}>
      <div className={styles.chips}>
        <Link
          href="/settings"
          className={`${styles.chip} ${
            pathname === '/settings' ? styles.active : ''
          }`}
        >
          Security
        </Link>
      </div>
      {children}
    </div>
  );
}

export default SettingsLayout;
