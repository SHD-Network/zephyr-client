import {
  CredentialRequestOptionsJSON,
  PublicKeyCredentialWithAssertionJSON,
  PublicKeyCredentialWithAttestationJSON,
  create,
  supported,
} from '@github/webauthn-json';
import { ApiController } from './ApiController';
import { randomBytes } from 'crypto';
import {
  AddKeysResponse,
  AuthMethodsResponse,
  AvailabilityResponse,
  ConfirmAccountResponse,
  LogoutResponse,
  SigninWithPasskeyResponse,
  SigninWithPasswordResponse,
  SignupWithPasskeyResponse,
  SignupWithPasswordResponse,
} from '@/@types/lib/api/AuthControllerTypes';

class AuthController extends ApiController {
  public async generateChallenge() {
    return this.cleanString(randomBytes(32).toString('base64'));
  }

  public async checkWebAuthnAvailability() {
    const isAvailable =
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return isAvailable && supported();
  }

  public async createCredential(username: string, email: string) {
    const challenge = await this.generateChallenge();
    const credential = await create({
      publicKey: {
        challenge,
        rp: {
          name: 'Zephyr',
          id:
            process.env.NODE_ENV === 'development'
              ? 'localhost'
              : process.env.NODE_ENV === 'test'
              ? 'localhost'
              : process.env.RPID ?? 'shd.network',
        },
        user: {
          id: window.crypto.randomUUID(),
          name: email,
          displayName: username,
        },
        pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
        timeout: 60000,
        attestation: 'direct',
        authenticatorSelection: {
          residentKey: 'required',
          userVerification: 'required',
        },
      },
    });

    return { challenge, credential };
  }

  public async createCredentialOptions(challenge: string) {
    const options: CredentialRequestOptionsJSON = {
      publicKey: {
        challenge,
        timeout: 60000,
        userVerification: 'required',
        rpId:
          process.env.NODE_ENV === 'development'
            ? 'localhost'
            : process.env.NODE_ENV === 'test'
            ? 'localhost'
            : process.env.RPID ?? 'shd.network',
      },
    };

    return options;
  }

  public async checkUsernameAvailability(username: string) {
    const response = await this.get<AvailabilityResponse>(
      `auth/available?username=${username}`,
    );
    return response.available;
  }

  public async checkEmailAvailability(email: string) {
    const response = await this.get<AvailabilityResponse>(
      `auth/available?email=${email}`,
    );
    return response.available;
  }

  public async signinWithPasskey(
    username: string,
    credential: PublicKeyCredentialWithAssertionJSON,
    challenge: string,
  ) {
    if (username === '') {
      throw new Error('Username cannot be empty');
    }

    const response = await this.post<SigninWithPasskeyResponse>(
      'auth/signin/passkey',
      {
        username,
        credential,
        challenge,
      },
    );

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    localStorage.setItem('zsn', response.zsn);

    return response;
  }

  public async signinWithPassword(username: string, password: string) {
    if (username === '') {
      throw new Error('Username cannot be empty');
    }

    if (password === '') {
      throw new Error('Password cannot be empty');
    }

    const response = await this.post<SigninWithPasswordResponse>(
      'auth/signin/password',
      {
        username,
        password,
      },
    );

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    localStorage.setItem('zsn', response.zsn);

    return response;
  }

  public async confirm() {
    const response = await this.post<ConfirmAccountResponse>('auth/confirm');

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    return response;
  }

  public async authMethods(username: string) {
    if (username === '') {
      throw new Error('Username cannot be empty');
    }

    const response = await this.get<AuthMethodsResponse>(
      `auth/methods?username=${username}`,
    );

    return response;
  }

  public async signupWithPassword(
    username: string,
    email: string,
    password: string,
  ) {
    if (username === '') {
      throw new Error('Username cannot be empty');
    }

    if (email === '') {
      throw new Error('Email cannot be empty');
    }

    if (password === '') {
      throw new Error('Password cannot be empty');
    }

    const response = await this.post<SignupWithPasswordResponse>(
      'auth/signup/password',
      {
        username,
        email,
        password,
      },
    );

    return response;
  }

  public async signupWithPasskey(
    username: string,
    email: string,
    credential: PublicKeyCredentialWithAttestationJSON,
    challenge: string,
  ) {
    if (username === '') {
      throw new Error('Username cannot be empty');
    }

    if (email === '') {
      throw new Error('Email cannot be empty');
    }

    const response = await this.post<SignupWithPasskeyResponse>(
      'auth/signup/passkey',
      {
        username,
        email,
        challenge,
        credential,
      },
    );

    return response;
  }

  public async addKeys(userId: string, userBundle: ArrayBuffer) {
    const bundleString = this.arrayBufferToString(userBundle);
    const response = await this.patch<AddKeysResponse>('auth/keys', {
      userId,
      bundle: bundleString,
    });

    return response;
  }

  public async logout() {
    const response = await this.delete<LogoutResponse>('auth/logout');
    return response;
  }
}

export const authController = new AuthController();
