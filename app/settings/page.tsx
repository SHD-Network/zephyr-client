'use client';

import { usePageSettings } from '@/redux';
import { useCallback, useEffect, useState } from 'react';
import styles from '@/styles/Pages/AccountSettings.module.scss';
import { authController, userController } from '@/lib/api';
import Setting from './settings';
import { Button } from '@/components';
import { get } from '@github/webauthn-json';
import { useRouter } from 'next/navigation';
import { SessionType } from '@/@types/lib/api/UserControllerTypes';

function Settings() {
  const setTitle = usePageSettings((state) => state.setTitle);
  const router = useRouter();

  // Enable modules
  const [addPasswordEnabled, setAddPasswordEnabled] = useState(false);
  const [addPasskeyEnabled, setAddPasskeyEnabled] = useState(false);

  const loadPage = useCallback(async () => {
    // Set page title
    setTitle('Settings');
    checkHasPassword();
    checkHasPasskey();
    loadSessions();
  }, [setTitle]);

  async function checkHasPassword() {
    const hasPassword = await userController.hasPassword();
    setAddPasswordEnabled(!hasPassword);
  }

  async function checkHasPasskey() {
    const hasPasskey = await userController.hasPasskey();
    setAddPasskeyEnabled(!hasPasskey);
  }

  // Add password to account
  const [addPasswordValue, setAddPasswordValue] = useState('');
  const [addPasswordConfirmValue, setAddPasswordConfirmValue] = useState('');

  async function addPasswordToAccount(e?: any) {
    if (e) {
      e.preventDefault();
    }

    if (addPasswordValue !== addPasswordConfirmValue) {
      throw new Error('Passwords do not match');
    }

    const challenge = await authController.generateChallenge();
    const options = await authController.createCredentialOptions(challenge);
    const credential = await get(options);

    try {
      const updatedUser = await userController.addPassword(
        addPasswordValue,
        credential,
        challenge,
      );
      console.log(updatedUser);
      router.refresh();
      return;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async function addPasskeyToAccount(e?: any) {
    if (e) {
      e.preventDefault();
    }
  }

  async function addAdditionalPasskeyToAccount(e?: any) {
    if (e) {
      e.preventDefault();
    }
  }

  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionType | null>(
    null,
  );

  async function loadSessions() {
    const allSessions = await userController.getSessions();
    setSessions(allSessions.allSessions);
    setCurrentSession(allSessions.currentSession);
  }

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return (
    <section className={styles.accountSettings}>
      {addPasswordEnabled ? (
        <Setting title="Add a password">
          <p>
            Your account does not currently have a password. If you wish to use
            your account on devices that do not support PassKeys, you will need
            to add a password to your account.
          </p>
          <form onSubmit={addPasswordToAccount}>
            <input
              type="password"
              placeholder="Password"
              value={addPasswordValue}
              onChange={(e) => setAddPasswordValue(e.currentTarget.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={addPasswordConfirmValue}
              onChange={(e) =>
                setAddPasswordConfirmValue(e.currentTarget.value)
              }
            />
            <Button label="Add password" onClick={addPasswordToAccount} />
          </form>
        </Setting>
      ) : null}
      {addPasskeyEnabled ? (
        <Setting title="Add a passkey">
          <p>
            Your account does not currently have a passkey. If you wish to add
            additional security to your account, you can add a passkey.
          </p>
          <form onSubmit={addPasskeyToAccount}>
            <Button label="Add passkey" onClick={addPasskeyToAccount} />
          </form>
        </Setting>
      ) : (
        <Setting title="Add another passkey">
          <p>
            Your account currently has at least one passkey. You are able to add
            as many passkeys as you would like, to ensure backup access to your
            account in the event that your passkey stops working.
          </p>
          <form onSubmit={addAdditionalPasskeyToAccount}>
            <Button
              label="Add another passkey"
              onClick={addAdditionalPasskeyToAccount}
            />
          </form>
        </Setting>
      )}
      <Setting title="Sessions">
        {currentSession === null ? null : (
          <div className={styles.currentSession}>
            <h3>Current session</h3>
            <p>
              <span>Session ID:</span> {currentSession.id}
            </p>
            <p>
              <span>Last active:</span>{' '}
              {new Date(currentSession.lastActive).toLocaleString()}
            </p>
          </div>
        )}
        {sessions
          .filter((session) => {
            console.log(session);
            if (currentSession === null) {
              return true;
            }

            if (currentSession.id === session.id) {
              return false;
            }

            return true;
          })
          .map((session) => {
            return session.id;
          })}
      </Setting>
    </section>
  );
}

export default Settings;
