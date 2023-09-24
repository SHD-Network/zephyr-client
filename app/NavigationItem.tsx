'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styles from '@/styles/Layouts/Layout.module.scss';

type NavigationItemProps = {
  icon: JSX.Element;
  label: string;
  href: string;
};

export default function NavigationItem({
  icon,
  label,
  href,
}: NavigationItemProps) {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  const checkStatus = useCallback(async () => {
    if (href === '/') {
      if (href === pathname) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } else {
      if (pathname.startsWith(href)) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  }, [href, pathname]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus, href, pathname]);

  return (
    <Link href={href}>
      <li className={`${styles.navItem} ${isActive ? styles.active : ''}`}>
        {icon}
        <span>{label}</span>
      </li>
    </Link>
  );
}
