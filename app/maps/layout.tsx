'use client';

import { usePageSettings } from '@/redux';
import { useCallback, useEffect } from 'react';

type MapsLayoutProps = {
  children: React.ReactNode;
};

function MapsLayout({ children }: MapsLayoutProps) {
  const setTitle = usePageSettings((state) => state.setTitle);

  const loadPage = useCallback(async () => {
    setTitle('Maps');
  }, [setTitle]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return <>{children}</>;
}

export default MapsLayout;
