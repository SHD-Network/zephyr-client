import { PublicKeyCredentialWithAttestationJSON } from '@github/webauthn-json';
import { ApiController } from './ApiController';
import {
  AddKeysResponse,
  SignupWithPasskeyResponse,
  SignupWithPasswordResponse,
} from '@/@types/lib/api/AuthControllerTypes';
import { SetupStatusResponse } from '@/@types/lib/api/SetupControllerTypes';

class SetupController extends ApiController {
  public async createAdminUserWithKey(
    username: string,
    email: string,
    challenge: string,
    credential: PublicKeyCredentialWithAttestationJSON,
  ) {
    if (username === '') {
      throw new Error('Username cannot be empty');
    }

    if (email === '') {
      throw new Error('Email cannot be empty');
    }

    const response = await this.post<SignupWithPasskeyResponse>(
      'setup/user/passkey',
      {
        username,
        email,
        challenge,
        credential,
      },
    );

    return response;
  }

  public async createAdminUserWithPassword(
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
      'setup/user/password',
      {
        username,
        email,
        password,
      },
    );

    return response;
  }

  public async addKeys(userId: string, userBundle: ArrayBuffer) {
    const bundleString = this.arrayBufferToString(userBundle);
    const response = await this.patch<AddKeysResponse>('setup/user/keys', {
      userId,
      bundle: bundleString,
    });

    return response;
  }

  public async getStatus() {
    const response = await this.get<SetupStatusResponse>('setup/status');
    return response;
  }
}

export const setupController = new SetupController();
