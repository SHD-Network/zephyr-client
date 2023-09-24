import { PublicKeyCredentialWithAssertionJSON } from '@github/webauthn-json';
import { ApiController } from './ApiController';
import {
  AddPasswordResponse,
  GetSessionsResponse,
  GetUserResponse,
  HasPasskeyResponse,
  HasPasswordResponse,
  ListUsersResponse,
  PublicKeyResponse,
  SearchUsersResponse,
} from '@/@types/lib/api/UserControllerTypes';

class UserController extends ApiController {
  public async publicKeyFromUsername(username: string) {
    if (username === '') {
      throw new Error('Username cannot be empty');
    }

    const response: PublicKeyResponse = await this.get(
      `user/username/${username}/publicKey`,
    );

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response.publicKey.keyValue.data;
  }

  public async publicKeyFromUserId(userId: string) {
    if (userId === '') {
      throw new Error('User ID cannot be empty');
    }

    const response = await this.get<PublicKeyResponse>(
      `user/id/${userId}/publicKey`,
    );

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response.publicKey.keyValue.data;
  }

  public async hasPassword() {
    const response = await this.get<HasPasswordResponse>(`user/hasPassword`);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    if (response.password === null) {
      return false;
    }

    return true;
  }

  public async hasPasskey() {
    const response = await this.get<HasPasskeyResponse>(`user/hasPasskey`);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    if (response.credentials === null || response.credentials.length === 0) {
      return false;
    }

    return true;
  }

  public async addPassword(
    password: string,
    credential: PublicKeyCredentialWithAssertionJSON,
    challenge: string,
  ) {
    if (password === '') {
      throw new Error('Password cannot be empty');
    }

    const userAuth = await this.post<AddPasswordResponse>(
      'auth/verify/passkey',
      {
        credential,
        challenge,
      },
    );

    if (userAuth.status !== 201) {
      throw new Error(userAuth.message);
    }

    const response = await this.patch(`user/addPassword`, {
      password,
    });

    return response;
  }

  public async getSessions() {
    const response = await this.get<GetSessionsResponse>(`user/sessions`);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getUserById(userId: string) {
    if (userId === '') {
      throw new Error('User ID cannot be empty');
    }

    const response = await this.get<GetUserResponse>(`user/uid/${userId}`);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getUser() {
    const response = await this.get<GetUserResponse>(`user/me`);

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async listUsers() {
    const response = await this.get<ListUsersResponse>('user');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async searchUsers(term: string) {
    const response = await this.get<SearchUsersResponse>(
      `messages/search/${term}`,
    );

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }
}

export const userController = new UserController();
