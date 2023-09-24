'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authController } from '@/lib/api';

function Logout() {
  const router = useRouter();

  const callLogout = useCallback(async () => {
    await authController.logout();
    router.replace('/signin');
  }, [router]);

  useEffect(() => {
    callLogout();
  }, [callLogout]);

  return <div></div>;
}

export default Logout;
