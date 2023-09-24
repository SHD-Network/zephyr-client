import { Socket, io } from 'socket.io-client';
import { ApiController } from './ApiController';
import { StorageController, cryptoController, userController } from '.';
import { ListMessagesResponse } from '@/@types/lib/api/MessageControllerTypes';

class MessageController extends ApiController {
  public socket: Socket;
  constructor() {
    super();
    this.socket = io(`${this.apiUrl}/messages`);
    this.setupListeners();
  }

  private setupListeners() {
    this.socket.on('connect', () => this.onConnect());
    this.socket.on('message', (message) => this.onMessage(message));
  }

  private onConnect() {
    this.joinRoom();
    console.log('Connected to message service');
  }

  private async joinRoom() {
    // const sessionId = await fetchSessionId();
    // if (sessionId === false) {
    //   this.socket.disconnect();
    //   return;
    // }

    this.socket.emit('joinRoom');
  }

  private async onMessage(message: { message: string; from: string }) {
    const storageController = await StorageController.create();
    const userIdentity = await storageController.loadIdentity();

    if (userIdentity === null) {
      return;
    }

    const sessionCipher = await storageController.loadSession(message.from);

    if (sessionCipher === null) {
      const decryptedMessage = await cryptoController.readFromChain(
        message.message,
        userIdentity,
      );

      if (decryptedMessage === undefined) {
        return;
      }

      await storageController.saveRemoteIdentity(
        message.from,
        decryptedMessage.newCipher.remoteIdentity,
      );

      await storageController.saveSession(
        message.from,
        decryptedMessage.newCipher,
      );

      console.log(decryptedMessage.messageString);
    } else {
      const decryptedMessage = await cryptoController.readFromChain(
        message.message,
        userIdentity,
        sessionCipher,
      );

      if (decryptedMessage === undefined) {
        return;
      }

      await storageController.saveSession(
        message.from,
        decryptedMessage.newCipher,
      );

      console.log(decryptedMessage.messageString);
    }
  }

  public init() {
    return;
  }

  public async send(userId: string, message: string) {
    if (userId === '' || message === '') {
      return;
    }

    const storageController = await StorageController.create();
    const userIdentity = await storageController.loadIdentity();

    if (userIdentity === null) {
      return;
    }

    const existingSession = await storageController.loadSession(userId);

    if (existingSession === null) {
      const publicKey = await userController.publicKeyFromUserId(userId);
      const chain = await cryptoController.createChain(
        userIdentity,
        publicKey,
        message,
      );

      await storageController.saveRemoteIdentity(
        userId,
        chain.cipher.remoteIdentity,
      );

      await storageController.saveSession(userId, chain.cipher);

      this.socket.emit('message', {
        userId,
        message: chain.message,
      });
    } else {
      const chain = await cryptoController.addToChain(existingSession, message);
      await storageController.saveSession(userId, chain.cipher);

      this.socket.emit('message', {
        userId,
        message: chain.message,
      });
    }
  }

  public async list() {
    const response = await this.get<ListMessagesResponse>(`messages/list`);
    return response;
  }
}

export const messageController = new MessageController();
