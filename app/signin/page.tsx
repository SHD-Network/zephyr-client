'use client';

import styles from '@/styles/Pages/Login.module.scss';
import { get } from '@github/webauthn-json';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authController } from '@/lib/api';
import { statusController } from '@/lib/api/StatusController';
import Link from 'next/link';
import {
  Button,
  Center,
  Container,
  Flex,
  Loader,
  PasswordInput,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { TbAt } from 'react-icons/tb';

function Login() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
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

  async function checkAuthMethods(username: string) {
    try {
      const authMethods = await authController.authMethods(username);
      setAuthMethods({
        password: authMethods.password,
        passkey: authMethods.passkey,
      });

      if (!authMethods.password && authMethods.passkey) {
        signinWithPasskey(username);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function signinWithPasskey(username: string) {
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

  async function signinWithPassword(username: string, password: string) {
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

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
  });

  function formSubmit(values: { username: string; password: string }) {
    if (authMethods === null) {
      checkAuthMethods(values.username);
      return;
    }

    if (authMethods.password && values.password !== '') {
      signinWithPassword(values.username, values.password);
      return;
    }
  }

  return (
    <Container size="md">
      <Center mih="100vh">
        {isAvailable === null && <Loader />}
        {isAvailable !== null && (
          <form onSubmit={form.onSubmit((values) => formSubmit(values))}>
            <Flex direction="column" justify="center" w={300} gap="xs">
              <TextInput
                withAsterisk
                label="Your username"
                leftSection={<TbAt />}
                leftSectionPointerEvents="none"
                {...form.getInputProps('username')}
              />
              {authMethods?.password && (
                <PasswordInput
                  withAsterisk
                  label="Your password"
                  {...form.getInputProps('password')}
                />
              )}
              {signinPending && (
                <Button fullWidth loading type="submit"></Button>
              )}
              {!signinPending && authMethods === null && (
                <Button fullWidth type="submit">
                  Continue
                </Button>
              )}
              {!signinPending && isAvailable && authMethods?.passkey && (
                <Button fullWidth type="submit">
                  Sign in with passkey
                </Button>
              )}
              {!signinPending && authMethods?.password && (
                <Button fullWidth type="submit">
                  Sign in with password
                </Button>
              )}
            </Flex>
          </form>
        )}
      </Center>
    </Container>
    // <section className={styles.loginPage}>
    //   <Window>
    //     {isAvailable === null ? (
    //       <div />
    //     ) : (
    //       <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
    //         {signinPending ? (
    //         ) : authMethods === null ||
    //           (isAvailable && authMethods.passkey && !authMethods.password) ? (
    //           <Button
    //             label={
    //               authMethods === null ? 'Sign in' : 'Sign in with passkey'
    //             }
    //             onClick={checkAuthMethods}
    //           />
    //         ) : (authMethods.password && !authMethods.passkey) ||
    //           !isAvailable ? (
    //           <Button
    //             label="Sign in with password"
    //             onClick={signinWithPassword}
    //           />
    //         ) : authMethods.password && authMethods.passkey && isAvailable ? (
    //           <div className={styles.buttons}>
    //             <Button
    //               label="Sign in with passkey"
    //               onClick={signinWithPasskey}
    //             />
    //             <Button
    //               label="Sign in with password"
    //               onClick={signinWithPassword}
    //             />
    //           </div>
    //         ) : null}
    //         {!registrationEnabled ? null : (
    //           <Link href="/signup">
    //             <p>Don&apos;t have an account? Sign up</p>
    //           </Link>
    //         )}
    //       </form>
    //     )}
    //   </Window>
    // </section>
  );
}

export default Login;
