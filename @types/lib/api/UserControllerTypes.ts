import { ApiResponse } from './ApiControllerTypes';

export type PublicKey = {
  publicKey: {
    keyValue: {
      data: ArrayBuffer;
    };
  };
};

export type PublicKeyResponse = ApiResponse & PublicKey;

export type HasPasswordResponse = ApiResponse & {
  password: string | null;
};

export type HasPasskeyResponse = ApiResponse & {
  credentials: {
    id: string;
    userId: string;
    name: string | null;
    externalId: string;
    publicKey: Buffer;
    signCount: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export type AddPasswordResponse = ApiResponse & {
  id: string;
  username: string;
  name: string | null;
  email: string;
  roleId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type SessionType = {
  id: string;
  lastActive: string;
  userId: string;
};

export type GetSessionsResponse = ApiResponse & {
  currentSession: SessionType;
  allSessions: SessionType[];
};

export type GetUserResponse = ApiResponse & {
  id: string;
  username: string;
  name: string | null;
  email: string;
  roleId: string | null;
  role: null | {
    id: string;
    name: string;
    permissions: {
      id: string;
      node: string;
      description: string;
    }[];
  };
  createdAt: Date;
  updatedAt: Date;
};

export type ListUsersResponse = ApiResponse & {
  users: {
    id: string;
    username: string;
    name: string | null;
    email: string;
    role: null | {
      id: string;
      name: string;
    };
    createdAt: Date;
    updatedAt: Date;
    session: {
      id: string;
      lastActive: string;
    }[];
  }[];
};

export type SearchUsersResponse = ApiResponse & {
  users: (PublicKey & {
    id: string;
    username: string;
    name: string | null;
  })[];
};
