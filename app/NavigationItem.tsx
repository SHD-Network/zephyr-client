'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styles from '@/styles/Layouts/Layout.module.scss';
import { NavLink } from '@mantine/core';

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
      <NavLink label={label} active={isActive} leftSection={icon} />
    </Link>
  );
}
