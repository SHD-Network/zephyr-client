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

const font = Oxanium({ subsets: ['latin'] });

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
  const socketStatus = usePageSettings((state) => state.socketStatus);
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

  // useEffect(() => {
  //   messageController.init();
  // }, []);

  return (
    <html lang="en">
      <body className={font.className}>
        {layout === 'loading' ? (
          <main>hello world</main>
        ) : layout === 'setup' ? (
          <main>{children}</main>
        ) : layout === 'login' ? (
          <main>{children}</main>
        ) : (
          <main>
            <div className={styles.layout}>
              <div className={styles.background} />
              <div className={styles.sidebar}>
                <div className={styles.logo}>Zephyr</div>
                <div className={styles.navigations}>
                  <ul className={styles.nav}>
                    <NavigationItem
                      href="/"
                      label="Dashboard"
                      icon={<TbLayoutGrid size={20} />}
                    />
                    {modules.news ? (
                      <NavigationItem
                        href="/news"
                        label="News"
                        icon={<TbNews size={20} />}
                      />
                    ) : null}
                    {modules.messages ? (
                      <NavigationItem
                        href="/messages"
                        label="Messages"
                        icon={<TbMessages size={20} />}
                      />
                    ) : null}
                    {modules.calendar ? (
                      <NavigationItem
                        href="/calendar"
                        label="Calendar"
                        icon={<TbCalendar size={20} />}
                      />
                    ) : null}
                    {modules.mail ? (
                      <NavigationItem
                        href="/mail"
                        label="Mail"
                        icon={<TbMail size={20} />}
                      />
                    ) : null}
                    {modules.maps && (
                      <NavigationItem
                        href="/maps"
                        label="Maps"
                        icon={<TbMap size={20} />}
                      />
                    )}
                    {modules.inventory ? (
                      <NavigationItem
                        href="/inventory"
                        label="Inventory"
                        icon={<TbClipboardList size={20} />}
                      />
                    ) : null}
                    {modules.documents ? (
                      <NavigationItem
                        href="/documents"
                        label="Documents"
                        icon={<TbFiles size={20} />}
                      />
                    ) : null}
                    {modules.crops ? (
                      <NavigationItem
                        href="/crops"
                        label="Crops"
                        icon={<TbPlant size={20} />}
                      />
                    ) : null}
                    {modules.defcon ? (
                      <NavigationItem
                        href="/defcon"
                        label="DEFCON"
                        icon={<TbAlertOctagon size={20} />}
                      />
                    ) : null}
                    {modules.pricing ? (
                      <NavigationItem
                        href="/pricing"
                        label="Live Pricing"
                        icon={<TbChartLine size={20} />}
                      />
                    ) : null}
                    {modules.wiki ? (
                      <NavigationItem
                        href="/wiki"
                        label="Wiki"
                        icon={<TbNotebook size={20} />}
                      />
                    ) : null}
                    {modules.home_monitoring ? (
                      <NavigationItem
                        href="/home"
                        label="Home Monitoring"
                        icon={<TbHomeBolt size={20} />}
                      />
                    ) : null}
                    {modules.security ? (
                      <NavigationItem
                        href="/security"
                        label="Security"
                        icon={<TbHomeShield size={20} />}
                      />
                    ) : null}
                  </ul>
                  <ul className={styles.nav}>
                    {!isAdmin ? null : (
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
                  </ul>
                </div>
                {version === '' ? null : (
                  <p className={styles.version}>v{version}</p>
                )}
              </div>
              <div className={styles.content}>
                {title === '' ? null : (
                  <div className={styles.titleBar}>
                    <h1>{title}</h1>
                    {socketStatus === null ? null : (
                      <div className={styles.socketStatus}>
                        <div
                          className={`${styles.indicator} ${
                            socketStatus ? styles.online : styles.offline
                          }`}
                        />
                        {socketStatus ? 'Connected' : 'Disconnected'}
                      </div>
                    )}
                  </div>
                )}
                {children}
              </div>
            </div>
          </main>
        )}
      </body>
    </html>
  );
}

export default Layout;
