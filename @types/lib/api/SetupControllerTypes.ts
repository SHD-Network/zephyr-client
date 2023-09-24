import { ApiResponse } from './ApiControllerTypes';

export type SetupStatusResponse = ApiResponse & {
  adminUser: boolean;
  loggedIn: boolean;
};
