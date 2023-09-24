'use client';
import { Toggle } from '@/components';
import { userController } from '@/lib/api';
import { statusController } from '@/lib/api/StatusController';
import styles from '@/styles/Pages/Admin.module.scss';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { TbEye, TbPencil } from 'react-icons/tb';
import { ListUsersResponse } from '@/@types/lib/api/UserControllerTypes';

function Users() {
  const [settings, setSettings] = useState({
    allowInvite: false,
    allowRegistration: false,
  });
  const [allUsers, setAllUsers] = useState<ListUsersResponse>();

  const loadPage = useCallback(async () => {
    loadAccountSettings();
    fetchUsers();
  }, []);

  async function loadAccountSettings() {
    const settingsData = await statusController.getAccountSettings();
    setSettings(settingsData);
  }

  async function updateSettings(key: string, value: boolean) {
    const updatedSettings = await statusController.updateAccountSettings(
      key,
      value,
    );
    setSettings(updatedSettings);
  }

  async function fetchUsers() {
    const users = await userController.listUsers();
    setAllUsers(users);
  }

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return (
    <section className={styles.users}>
      <Setting
        name="Allow registration invites"
        keyValue="allowInvite"
        status={settings.allowInvite}
        onChange={updateSettings}
      />
      <Setting
        name="Allow anyone to register"
        keyValue="allowRegistration"
        status={settings.allowRegistration}
        onChange={updateSettings}
      />
      <div className={styles.filter}>
        <h3>All users</h3>
      </div>
      <div className={styles.table}>
        <div className={`${styles.cell} ${styles.header}`}>User ID</div>
        <div className={`${styles.cell} ${styles.header}`}>Username</div>
        <div className={`${styles.cell} ${styles.header}`}>Email</div>
        <div className={`${styles.buttons} ${styles.header}`}></div>
        {allUsers?.users.map((user, index) => {
          return (
            <>
              <div
                className={`${styles.cell} ${
                  index % 2 === 0 ? styles.even : ''
                }`}
              >
                {user.id}
              </div>
              <div
                className={`${styles.cell} ${
                  index % 2 === 0 ? styles.even : ''
                }`}
              >
                {user.username}
              </div>
              <div
                className={`${styles.cell} ${styles.hidden} ${
                  index % 2 === 0 ? styles.even : ''
                }`}
              >
                <span>{user.email}</span>
              </div>
              <div
                className={`${styles.buttons} ${
                  index % 2 === 0 ? styles.even : ''
                }`}
              >
                <Link href={`/admin/users/${user.id}`}>
                  <div className={styles.button}>
                    <TbEye />
                  </div>
                </Link>
                <Link href={`/admin/users/${user.id}/edit`}>
                  <div className={styles.button}>
                    <TbPencil />
                  </div>
                </Link>
              </div>
            </>
          );
        })}
      </div>
    </section>
  );
}

type SettingProps = {
  name: string;
  keyValue: string;
  status: boolean;
  onChange: (keyValue: string, status: boolean) => void;
};

function Setting({ name, status, onChange, keyValue }: SettingProps) {
  return (
    <div className={styles.setting}>
      <h3>{name}</h3>
      <Toggle value={status} onChange={() => onChange(keyValue, !status)} />
    </div>
  );
}

export default Users;
