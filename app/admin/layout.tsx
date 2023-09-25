'use client';

import { useUserSettings } from '@/redux';
import { Badge, Container, Flex } from '@mantine/core';
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
    <Container fluid>
      <Flex gap="xs" mb="md">
        <Link href="/admin">
          <Badge
            variant={pathname === '/admin' ? 'filled' : 'outline'}
            size="lg"
          >
            System
          </Badge>
        </Link>
        <Link href="/admin/modules">
          <Badge
            variant={
              pathname.startsWith('/admin/modules') ? 'filled' : 'outline'
            }
            size="lg"
          >
            Modules
          </Badge>
        </Link>
        <Link href="/admin/users">
          <Badge
            variant={pathname.startsWith('/admin/users') ? 'filled' : 'outline'}
            size="lg"
          >
            Users
          </Badge>
        </Link>
      </Flex>
      {children}
    </Container>
  );
}

export default AdminLayout;
