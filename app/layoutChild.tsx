'use client';

import { Oxanium } from 'next/font/google';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styles from '@/styles/Layouts/Layout.module.scss';
import NavigationItem from './NavigationItem';
import {
  TbAlertOctagon,
  TbCalendar,
  TbChartLine,
  TbClipboardList,
  TbFiles,
  TbHomeBolt,
  TbHomeShield,
  TbLayoutGrid,
  TbLogout,
  TbMail,
  TbMap,
  TbMessages,
  TbNews,
  TbNotebook,
  TbPlant,
  TbSettings,
  TbShield,
  TbUserCircle,
} from 'react-icons/tb';
import { authController, setupController, userController } from '@/lib/api';
import { useAppSettings, usePageSettings, useUserSettings } from '@/redux';
import { statusController } from '@/lib/api/StatusController';
import useSWR from 'swr';
import {
  AppShell,
  Badge,
  Box,
  Burger,
  Center,
  Flex,
  Group,
  Loader,
  NavLink,
  ScrollArea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';

export type Modules = {
  calendar: boolean;
  crops: boolean;
  defcon: boolean;
  documents: boolean;
  home_monitoring: boolean;
  inventory: boolean;
  mail: boolean;
  maps: boolean;
  messages: boolean;
  news: boolean;
  pricing: boolean;
  security: boolean;
  wiki: boolean;
};

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [layout, setLayout] = useState<
    'dashboard' | 'setup' | 'login' | 'loading'
  >('loading');
  const title = usePageSettings((state) => state.title);
  const isAdmin = useUserSettings((state) => state.isAdmin);
  const setIsAdmin = useUserSettings((state) => state.setIsAdmin);
  const setRole = useUserSettings((state) => state.setRole);
  const version = useAppSettings((state) => state.version);
  const setVersion = useAppSettings((state) => state.setVersion);
  const modules = useAppSettings((state) => state.modules);
  const setModules = useAppSettings((state) => state.setModules);

  const { data: versionData } = useSWR('status-getVersion', () =>
    statusController.getVersion(),
  );

  useEffect(() => {
    if (versionData === undefined) {
      return;
    }

    setVersion(versionData.version);
  }, [versionData, setVersion]);

  const checkLayout = useCallback(async () => {
    if (pathname.startsWith('/setup')) {
      setLayout('setup');
      return;
    }

    if (
      pathname.startsWith('/signin') ||
      pathname.startsWith('/logout') ||
      pathname.startsWith('/signup')
    ) {
      setLayout('login');
      return;
    }

    setLayout('dashboard');
    return;
  }, [pathname]);

  const checkPermissions = useCallback(async () => {
    const user = await userController.getUser();

    if (user.role === null) {
      return;
    }

    setRole(user.role);

    const permissions = user.role.permissions;

    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i];

      if (permission.node === '*') {
        setIsAdmin(true);
        break;
      }
    }
  }, [setIsAdmin, setRole]);

  const checkPath = useCallback(async () => {
    const setupStatus = await setupController.getStatus();
    const userExists = setupStatus.adminUser;
    const loggedIn = setupStatus.loggedIn;

    if (!userExists) {
      if (!pathname.startsWith('/setup')) {
        router.replace('/setup');
        return;
      }

      return;
    }

    if (!pathname.startsWith('/signin') && !pathname.startsWith('/signup')) {
      if (!loggedIn) {
        router.replace('/signin');
        return;
      }

      const userConfirmed = await authController.confirm();

      if (!userConfirmed.authenticated) {
        router.replace('/logout');
        return;
      }
    }

    if (pathname.startsWith('/signin') || pathname.startsWith('/signup')) {
      if (loggedIn) {
        router.replace('/');
        return;
      }
    }

    if (loggedIn) {
      checkPermissions();
    }

    checkLayout();
  }, [pathname, router, checkPermissions, checkLayout]);

  const checkEnabledModules = useCallback(async () => {
    const enabledModules =
      (await statusController.getEnabledModules()) as Modules;
    setModules(enabledModules);
  }, [setModules]);

  const loadPage = useCallback(() => {
    checkPath();
    checkEnabledModules();
  }, [checkPath, checkEnabledModules]);

  useEffect(() => {
    loadPage();
  }, [pathname, loadPage]);

  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      {layout === 'loading' ? (
        <Center mih="100vh">
          <Loader />
        </Center>
      ) : layout === 'setup' ? (
        <main>{children}</main>
      ) : layout === 'login' ? (
        <main>{children}</main>
      ) : (
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 250,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <AppShell.Header>
            <Flex direction="row" align="center" h="100%">
              <Group h="100%" px="md" w={250}>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Box
                  bg="red.8"
                  component="div"
                  h="60%"
                  display="flex"
                  px="md"
                  visibleFrom="sm"
                  style={{
                    alignItems: 'center',
                    textTransform: 'uppercase',
                    userSelect: 'none',
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontSize: '1.2rem',
                      letterSpacing: '15px',
                      marginRight: '-15px',
                    }}
                  >
                    Zephyr
                  </span>
                </Box>
              </Group>
              <Group px="md">
                {title !== '' && (
                  <Title order={1} size="h2" style={{ paddingTop: '3px' }}>
                    {title}
                  </Title>
                )}
              </Group>
            </Flex>
          </AppShell.Header>
          <AppShell.Navbar p="md">
            <Flex direction="column" justify="space-between" h="100%">
              <Flex direction="column">
                <NavigationItem
                  href="/"
                  label="Dashboard"
                  icon={<TbLayoutGrid size={20} />}
                />
                {modules.news && (
                  <NavigationItem
                    href="/news"
                    label="News"
                    icon={<TbNews size={20} />}
                  />
                )}
                {modules.messages && (
                  <NavigationItem
                    href="/messages"
                    label="Messages"
                    icon={<TbMessages size={20} />}
                  />
                )}
                {modules.calendar && (
                  <NavigationItem
                    href="/calendar"
                    label="Calendar"
                    icon={<TbCalendar size={20} />}
                  />
                )}
                {modules.mail && (
                  <NavigationItem
                    href="/mail"
                    label="Mail"
                    icon={<TbMail size={20} />}
                  />
                )}
                {modules.maps && (
                  <NavigationItem
                    href="/maps"
                    label="Maps"
                    icon={<TbMap size={20} />}
                  />
                )}
                {modules.inventory && (
                  <NavigationItem
                    href="/inventory"
                    label="Inventory"
                    icon={<TbClipboardList size={20} />}
                  />
                )}
                {modules.documents && (
                  <NavigationItem
                    href="/documents"
                    label="Documents"
                    icon={<TbFiles size={20} />}
                  />
                )}
                {modules.crops && (
                  <NavigationItem
                    href="/crops"
                    label="Crops"
                    icon={<TbPlant size={20} />}
                  />
                )}
                {modules.defcon && (
                  <NavigationItem
                    href="/defcon"
                    label="DEFCON"
                    icon={<TbAlertOctagon size={20} />}
                  />
                )}
                {modules.pricing && (
                  <NavigationItem
                    href="/pricing"
                    label="Live Pricing"
                    icon={<TbChartLine size={20} />}
                  />
                )}
                {modules.wiki && (
                  <NavigationItem
                    href="/wiki"
                    label="Wiki"
                    icon={<TbNotebook size={20} />}
                  />
                )}
                {modules.home_monitoring && (
                  <NavigationItem
                    href="/home"
                    label="Home Monitoring"
                    icon={<TbHomeBolt size={20} />}
                  />
                )}
                {modules.security && (
                  <NavigationItem
                    href="/security"
                    label="Security"
                    icon={<TbHomeShield size={20} />}
                  />
                )}
              </Flex>
              <Flex direction="column">
                {isAdmin && (
                  <NavigationItem
                    href="/admin"
                    label="Admin"
                    icon={<TbShield size={20} />}
                  />
                )}
                <NavigationItem
                  href="/account"
                  label="Your account"
                  icon={<TbUserCircle size={20} />}
                />
                <NavigationItem
                  href="/settings"
                  label="Settings"
                  icon={<TbSettings size={20} />}
                />
                <NavigationItem
                  href="/logout"
                  label="Logout"
                  icon={<TbLogout size={20} />}
                />
                {version !== '' && (
                  <NavLink
                    label={`v${version}`}
                    disabled
                    rightSection={<Badge>Update available</Badge>}
                  />
                )}
              </Flex>
            </Flex>
          </AppShell.Navbar>
          <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
      )}
    </>
  );
}

export default Layout;
