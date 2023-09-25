'use client';

import { usePageSettings } from '@/redux';
import { useCallback, useEffect } from 'react';
import styles from '@/styles/Pages/Admin.module.scss';
import { Stack } from '@mantine/core';

// type VersionData = {
//   currentVersion: string;
//   latestVersion: string;
//   hasUpdate: boolean;
//   updateDetails: null | {
//     name: string;
//     releaseDate: string;
//     body: string;
//   };
// };

function AdminPage() {
  const setTitle = usePageSettings((state) => state.setTitle);
  // const [versionData, setVersionData] = useState<VersionData | null>(null);
  const versionData = null;

  const loadPage = useCallback(async () => {
    setTitle('Admin');
    // loadVersionData();
  }, [setTitle]);

  // async function loadVersionData() {
  //   const response = (await statusController.checkForUpdate()) as VersionData;
  //   setVersionData(response);
  // }

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return (
    <Stack></Stack>
    // <section className={styles.system}>
    //   {versionData === null ? null : (
    //     <div className={styles.currentVersion}>
    //       <h2>{versionData.currentVersion}</h2>
    //       <p>Installed version</p>
    //     </div>
    //   )}
    //   {versionData === null ? null : (
    //     <div className={styles.latestVersion}>
    //       <h2>{versionData.latestVersion}</h2>
    //       <p>Latest version</p>
    //     </div>
    //   )}
    //   {versionData === null ? null : <div className={styles.update}></div>}
    // </section>
  );
}

export default AdminPage;
