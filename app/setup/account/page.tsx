'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/Pages/Setup.module.scss';
import { Button, Window } from '@/components';
import { useRouter } from 'next/navigation';
import {
  authController,
  cryptoController,
  setupController,
} from '@/lib/api';
import { StorageController } from '@/lib/api/StorageController';

function SetupAccount() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [usePassword, setUsePassword] = useState(false);

  async function checkWebauth() {
    const available = await authController.checkWebAuthnAvailability();
    setIsAvailable(available);
    setUsePassword(!available);
  }

  async function createAccountWithPassword() {
    const usernameAvailable = await authController.checkUsernameAvailability(
      username,
    );

    if (!usernameAvailable) {
      console.log('username not available');
      return;
    }

    const emailAvailable = await authController.checkEmailAvailability(email);

    if (!emailAvailable) {
      console.log('email not available');
      return;
    }

    const newUser = await setupController.createAdminUserWithPassword(
      username,
      email,
      password,
    );

    const storageController = await StorageController.create();

    const userIdentity = await cryptoController.createIdentity(newUser.id);
    const userBundle = await cryptoController.createBundle(userIdentity);

    await storageController.saveIdentity(userIdentity);

    await setupController.addKeys(newUser.id, userBundle);

    router.push(`/signin/success?zsn=${newUser.session}`);
  }

  async function createAccountWithKey() {
    const usernameAvailable = await authController.checkUsernameAvailability(
      username,
    );

    if (!usernameAvailable) {
      console.log('username not available');
      return;
    }

    const emailAvailable = await authController.checkEmailAvailability(email);

    if (!emailAvailable) {
      console.log('email not available');
      return;
    }

    const { challenge, credential } = await authController.createCredential(
      username,
      email,
    );

    if (credential === null) {
      console.log('credential is null');
      return;
    }

    const newUser = await setupController.createAdminUserWithKey(
      username,
      email,
      challenge,
      credential,
    );

    const storageController = await StorageController.create();

    const userIdentity = await cryptoController.createIdentity(newUser.id);
    const userBundle = await cryptoController.createBundle(userIdentity);

    await storageController.saveIdentity(userIdentity);

    await setupController.addKeys(newUser.id, userBundle);

    router.push(`/signin/success?zsn=${newUser.session}`);
  }

  useEffect(() => {
    checkWebauth();
  }, []);

  return (
    <section className={styles.setupPage}>
      <Window>
        {isAvailable === null ? (
          <div />
        ) : (
          <form className={styles.form}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              required
            />
            {usePassword ? (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required={!isAvailable}
              />
            ) : null}
            {isAvailable && !usePassword ? (
              <Button
                label="Create with passkey"
                onClick={createAccountWithKey}
              />
            ) : (
              <Button
                label="Create with password"
                onClick={createAccountWithPassword}
              />
            )}
            {isAvailable && usePassword ? (
              <p
                className={styles.toggleMethod}
                onClick={() => setUsePassword(false)}
              >
                Create with passkey instead
              </p>
            ) : isAvailable && !usePassword ? (
              <p
                className={styles.toggleMethod}
                onClick={() => setUsePassword(true)}
              >
                Create with password instead
              </p>
            ) : null}
          </form>
        )}
      </Window>
    </section>
  );
}
export default SetupAccount;
