import { ApiResponse } from './ApiControllerTypes';

export type DefconUpdate = {
  date: string;
  value: string;
};

export type DefconLevel = ApiResponse & {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  DefconUpdates: DefconUpdate[];
};
