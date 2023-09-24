import { ApiResponse } from '@/@types/lib/api/ApiControllerTypes';
const decoder = new TextDecoder('utf-8');

export class ApiController {
  protected HostSettings = {
    expectedOrigin: process.env.APP_URL ?? 'http://localhost:3000',
    expectedRPID:
      process.env.NODE_ENV === 'development'
        ? 'localhost'
        : process.env.NODE_ENV === 'test'
        ? 'localhost'
        : process.env.RPID ?? 'shd.network',
  };

  protected apiUrl = 'http://localhost:3828/api';

  protected cleanString(string: string) {
    return string.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  protected binaryToBase64Url(bytes: Uint8Array) {
    let string = '';

    bytes.forEach((charCode) => {
      string += String.fromCharCode(charCode);
    });

    return btoa(string);
  }

  protected arrayBufferToString(buffer: ArrayBuffer) {
    // return String.fromCharCode(...new Uint8Array(buffer));
    return decoder.decode(new Uint8Array(buffer));
  }

  protected base64ToArrayBuffer(base64: string) {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  }

  protected stringToArrayBuffer(keyString: string) {
    const buffer = new ArrayBuffer(keyString.length);
    const bufferView = new Uint8Array(buffer);

    for (let i = 0; i < keyString.length; i++) {
      bufferView[i] = keyString.charCodeAt(i);
    }

    return buffer;
  }

  protected async request(endpoint: string, method: string, body?: any) {
    const sessionId = localStorage.getItem('zsn');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionId}`,
    };

    return await fetch(`${this.apiUrl}/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  protected async get<T extends ApiResponse>(endpoint: string): Promise<T> {
    const response = await this.request(endpoint, 'GET');
    const data = await response.json();

    return {
      ...data,
      status: response.status,
    };
  }

  protected async post<T extends ApiResponse>(
    endpoint: string,
    body = {},
  ): Promise<T> {
    const response = await this.request(endpoint, 'POST', body);
    const data = await response.json();

    return {
      ...data,
      status: response.status,
    };
  }

  protected async patch<T extends ApiResponse>(
    endpoint: string,
    body = {},
  ): Promise<T> {
    const response = await this.request(endpoint, 'PATCH', body);
    const data = await response.json();

    return {
      ...data,
      status: response.status,
    };
  }

  protected async delete<T extends ApiResponse>(
    endpoint: string,
    body = {},
  ): Promise<T> {
    const response = await this.request(endpoint, 'DELETE', body);
    const data = await response.json();

    return {
      ...data,
      status: response.status,
    };
  }
}
