'use client';
import { usePageSettings } from '@/redux';
import { useCallback, useEffect } from 'react';

type DefconLayoutProps = {
  children: React.ReactNode;
};

function CalendarLayout({ children }: DefconLayoutProps) {
  const setTitle = usePageSettings((state) => state.setTitle);

  const loadPage = useCallback(async () => {
    setTitle('Calendar');
  }, [setTitle]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return <>{children}</>;
}

export default CalendarLayout;
