'use client';

import { usePageSettings } from '@/redux';
import { useCallback, useEffect } from 'react';

type DefconLayoutProps = {
  children: React.ReactNode;
};

function DefconLayout({ children }: DefconLayoutProps) {
  const setTitle = usePageSettings((state) => state.setTitle);

  const loadPage = useCallback(async () => {
    setTitle('DEFCON');
  }, [setTitle]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return <>{children}</>;
}

export default DefconLayout;
