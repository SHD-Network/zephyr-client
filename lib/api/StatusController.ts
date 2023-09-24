import {
  AccountSettingsResponse,
  ModulesResponse,
  SystemStatusResponse,
  UpdateResponse,
} from '@/@types/lib/api/StatusControllerTypes';
import { ApiController } from './ApiController';

class StatusController extends ApiController {
  public async getEnabledModules() {
    const response = await this.get<ModulesResponse>('status/modules/enabled');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async updateModule(module: string, status: boolean) {
    const response = await this.patch<ModulesResponse>(
      'status/modules/update',
      {
        module,
        status,
      },
    );

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getAccountSettings() {
    const response = await this.get<AccountSettingsResponse>('status/account');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async updateAccountSettings(setting: string, value: boolean) {
    const response = await this.patch<AccountSettingsResponse>(
      'status/account',
      {
        setting,
        value,
      },
    );

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getVersion() {
    const response = await this.get<SystemStatusResponse>('status/version');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async checkForUpdate() {
    const response = await this.get<UpdateResponse>('status/update');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }
}

export const statusController = new StatusController();
