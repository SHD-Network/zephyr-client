import { ApiResponse } from './ApiControllerTypes';

export type AvailabilityResponse = ApiResponse & {
  available: boolean;
};

export type SigninWithPasskeyResponse = ApiResponse & {
  challenge: string;
  zsn: string;
  id: string;
  username: string;
};

export type SigninWithPasswordResponse = ApiResponse & {
  id: string;
  username: string;
  zsn: string;
};

export type ConfirmAccountResponse = ApiResponse & {
  authenticated: boolean;
};

export type AuthMethodsResponse = ApiResponse & {
  password: boolean;
  passkey: boolean;
};

export type SignupWithPasswordResponse = ApiResponse & {
  session: string;
  id: string;
  username: string;
  name: string | null;
  email: string;
  roleId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SignupWithPasskeyResponse = ApiResponse & {
  challenge: string;
  session: string;
  id: string;
  username: string;
  name: string | null;
  email: string;
  roleId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AddKeysResponse = ApiResponse & {
  id: string;
  username: string;
  name: string | null;
  email: string;
  roleId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LogoutResponse = ApiResponse & {
  loggedOut: boolean;
};
