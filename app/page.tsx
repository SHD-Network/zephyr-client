'use client';

import { usePageSettings } from '@/redux';
import { useEffect } from 'react';

function Home() {
  const setTitle = usePageSettings((state) => state.setTitle);

  useEffect(() => {
    setTitle('Dashboard');
  }, [setTitle]);

  return <div>hello</div>;
}

export default Home;
