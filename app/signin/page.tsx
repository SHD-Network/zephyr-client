'use client';

import { Button, Window } from '@/components';
import styles from '@/styles/Pages/Login.module.scss';
import { get } from '@github/webauthn-json';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authController } from '@/lib/api';
import { statusController } from '@/lib/api/StatusController';
import Link from 'next/link';

function Login() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [authMethods, setAuthMethods] = useState<{
    password: boolean;
    passkey: boolean;
  } | null>(null);
  const [signinPending, setSigninPending] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(false);

  async function checkAvailable() {
    const available = await authController.checkWebAuthnAvailability();
    setIsAvailable(available);
  }

  async function checkRegistration() {
    const accountSettings = await statusController.getAccountSettings();

    if (accountSettings.allowRegistration) {
      setRegistrationEnabled(true);
      return;
    }

    setRegistrationEnabled(false);
    return;
  }

  async function checkAuthMethods(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    try {
      const authMethods = await authController.authMethods(username);
      setAuthMethods({
        password: authMethods.password,
        passkey: authMethods.passkey,
      });

      if (!authMethods.password && authMethods.passkey) {
        signinWithPasskey();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function signinWithPasskey(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    setSigninPending(true);

    const challenge = await authController.generateChallenge();
    const options = await authController.createCredentialOptions(challenge);
    const credential = await get(options);

    try {
      await authController.signinWithPasskey(username, credential, challenge);
      setSigninPending(false);
      router.push(`/`);
      return;
    } catch (error) {
      setSigninPending(false);
      console.error(error);
      return;
    }
  }

  async function signinWithPassword(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }

    setSigninPending(true);

    try {
      await authController.signinWithPassword(username, password);
      setSigninPending(false);
      router.push(`/`);
      return;
    } catch (error) {
      setSigninPending(false);
      console.error(error);
      return;
    }
  }

  useEffect(() => {
    checkAvailable();
    checkRegistration();
  }, []);

  return (
    <section className={styles.loginPage}>
      <Window>
        {isAvailable === null ? (
          <div />
        ) : (
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            {authMethods?.password ? (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            ) : null}
            {signinPending ? (
              <Button pending={true} />
            ) : authMethods === null ||
              (isAvailable && authMethods.passkey && !authMethods.password) ? (
              <Button
                label={
                  authMethods === null ? 'Sign in' : 'Sign in with passkey'
                }
                onClick={checkAuthMethods}
              />
            ) : (authMethods.password && !authMethods.passkey) ||
              !isAvailable ? (
              <Button
                label="Sign in with password"
                onClick={signinWithPassword}
              />
            ) : authMethods.password && authMethods.passkey && isAvailable ? (
              <div className={styles.buttons}>
                <Button
                  label="Sign in with passkey"
                  onClick={signinWithPasskey}
                />
                <Button
                  label="Sign in with password"
                  onClick={signinWithPassword}
                />
              </div>
            ) : null}
            {!registrationEnabled ? null : (
              <Link href="/signup">
                <p>Don&apos;t have an account? Sign up</p>
              </Link>
            )}
          </form>
        )}
      </Window>
    </section>
  );
}

export default Login;
