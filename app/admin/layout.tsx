'use client';

import { useUserSettings } from '@/redux';
import styles from '@/styles/Layouts/SettingsLayout.module.scss';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

type SettingsLayoutProps = {
  children: React.ReactNode;
};

function AdminLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const isAdmin = useUserSettings((state) => state.isAdmin);
  const router = useRouter();

  const pathnameChange = useCallback(async () => {
    if (!isAdmin) {
      router.replace('/');
      return;
    }
  }, [isAdmin, router]);

  useEffect(() => {
    pathnameChange();
  }, [pathname, isAdmin, pathnameChange]);

  return (
    <div className={styles.settingsLayout}>
      <div className={styles.chips}>
        <Link
          href="/admin"
          className={`${styles.chip} ${
            pathname === '/admin' ? styles.active : ''
          }`}
        >
          System
        </Link>
        <Link
          href="/admin/modules"
          className={`${styles.chip} ${
            pathname.startsWith('/admin/modules') ? styles.active : ''
          }`}
        >
          Modules
        </Link>
        <Link
          href="/admin/users"
          className={`${styles.chip} ${
            pathname.startsWith('/admin/users') ? styles.active : ''
          }`}
        >
          Users
        </Link>
      </div>
      {children}
    </div>
  );
}

export default AdminLayout;
