import { DefconLevel } from '@/@types/lib/api/DefconControllerTypes';
import { ApiController } from './ApiController';

class DefconController extends ApiController {
  public readonly SWR = {
    getOverallLevel: 'DefconController-getOverallLevel',
    getAfricaLevel: 'DefconController-getAfricaLevel',
    getMideastLevel: 'DefconController-getMideastLevel',
    getCyberLevel: 'DefconController-getCyberLevel',
    getEuropeLevel: 'DefconController-getEuropeLevel',
    getAsiaLevel: 'DefconController-getAsiaLevel',
    getUsaLevel: 'DefconController-getUsaLevel',
    getLatamLevel: 'DefconController-getLatamLevel',
    getSpaceLevel: 'DefconController-getSpaceLevel',
    getSpecOpsLevel: 'DefconController-getSpecOpsLevel',
  };

  public async getOverallLevel() {
    const response = await this.get<DefconLevel>('defcon');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getAfricaLevel() {
    const response = await this.get<DefconLevel>('defcon/africa');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getMideastLevel() {
    const response = await this.get<DefconLevel>('defcon/mideast');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getCyberLevel() {
    const response = await this.get<DefconLevel>('defcon/cyber');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getEuropeLevel() {
    const response = await this.get<DefconLevel>('defcon/europe');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getAsiaLevel() {
    const response = await this.get<DefconLevel>('defcon/asia');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getUsaLevel() {
    const response = await this.get<DefconLevel>('defcon/usa');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getLatamLevel() {
    const response = await this.get<DefconLevel>('defcon/latam');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getSpaceLevel() {
    const response = await this.get<DefconLevel>('defcon/space');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }

  public async getSpecOpsLevel() {
    const response = await this.get<DefconLevel>('defcon/specops');

    if (response.status !== 200) {
      throw new Error(response.message);
    }

    return response;
  }
}

export const defconController = new DefconController();
