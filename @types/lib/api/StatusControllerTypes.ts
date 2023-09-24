import { ApiResponse } from './ApiControllerTypes';

export type ModulesResponse = ApiResponse & {
  calendar: boolean;
  crops: boolean;
  defcon: boolean;
  documents: boolean;
  home_monitoring: boolean;
  inventory: boolean;
  mail: boolean;
  maps: boolean;
  messages: boolean;
  news: boolean;
  pricing: boolean;
  security: boolean;
  wiki: boolean;
};

export type AccountSettingsResponse = ApiResponse & {
  allowInvite: boolean;
  allowRegistration: boolean;
};

export type SystemStatusResponse = ApiResponse & {
  version: string;
};

export type UpdateResponse = ApiResponse & {
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
  updateDetails: {
    name: string;
    body: string;
    releaseDate: string;
  };
};
