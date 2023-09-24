import { ApiController } from './ApiController';
import {
  Identity,
  PreKeyBundleProtocol,
  ECPublicKey,
  AsymmetricRatchet,
  PreKeyMessageProtocol,
  MessageSignedProtocol,
} from '2key-ratchet';

class CryptoController extends ApiController {
  public async createIdentity(userId: string) {
    const userIdentity = await Identity.create(userId, 1, 0, true);
    return userIdentity;
  }

  public async importIdentity(userIdentityString: string) {
    const userIdentityJson = JSON.parse(userIdentityString);
    const userIdentity = await Identity.fromJSON(userIdentityJson);
    return userIdentity;
  }

  public async getFingerprint(userIdentity: Identity) {
    const privateKey = userIdentity.signingKey.privateKey;
    const privateKeyString = this.exportKey(privateKey, 'private');
    console.log(privateKeyString);
  }

  public async createBundle(userIdentity: Identity) {
    const bundle = new PreKeyBundleProtocol();

    await bundle.identity.fill(userIdentity);
    bundle.registrationId = userIdentity.id;
    const preKey = userIdentity.signedPreKeys[0];
    bundle.preKeySigned.id = 0;
    bundle.preKeySigned.key = preKey.publicKey;
    await bundle.preKeySigned.sign(userIdentity.signingKey.privateKey);

    const arrayBuffer = await bundle.exportProto();
    return arrayBuffer;
  }

  public async isTrusted(arrayBuffer: ArrayBuffer, publicKey: ECPublicKey) {
    const bundle = await this.importBundle(arrayBuffer);
    const trusted = await bundle.preKeySigned.verify(publicKey);

    if (!trusted) {
      return false;
    }

    return true;
  }

  public async importBundle(arrayBuffer: ArrayBuffer) {
    const bundle = await PreKeyBundleProtocol.importProto(arrayBuffer);
    return bundle;
  }

  public async createChain(
    userIdentity: Identity,
    arrayBuffer: ArrayBuffer,
    firstMessage: string,
  ) {
    const bundle = await this.importBundle(arrayBuffer);
    const cipher = await AsymmetricRatchet.create(userIdentity, bundle);
    const preKeyMessage = await cipher.encrypt(
      this.stringToArrayBuffer(firstMessage),
    );
    const encryptedMessage = await preKeyMessage.exportProto();

    return {
      message: this.arrayBufferToString(encryptedMessage),
      cipher,
    };
  }

  public async addToChain(cipher: AsymmetricRatchet, message: string) {
    const messageBuffer = this.stringToArrayBuffer(message);
    const encryptedMessage = await cipher.encrypt(messageBuffer);
    const encryptedMessageBuffer = await encryptedMessage.exportProto();
    const encryptedMessageString = this.arrayBufferToString(
      encryptedMessageBuffer,
    );

    return {
      message: encryptedMessageString,
      cipher,
    };
  }

  public async readFromChain(
    message: string,
    userIdentity: Identity,
    cipher?: AsymmetricRatchet,
  ) {
    const messageBuffer = this.stringToArrayBuffer(message);
    let decryptedMessage: MessageSignedProtocol;
    let newCipher: AsymmetricRatchet | null = cipher ?? null;

    if (newCipher !== null) {
      decryptedMessage = await MessageSignedProtocol.importProto(messageBuffer);
    } else {
      let preKeyMessage: PreKeyMessageProtocol;

      try {
        preKeyMessage = await PreKeyMessageProtocol.importProto(messageBuffer);
      } catch (error) {
        console.error('incoming message is not prekeymessage');
        return;
      }

      decryptedMessage = preKeyMessage.signedMessage;
      newCipher = await AsymmetricRatchet.create(userIdentity, preKeyMessage);
    }

    const messageData = await newCipher.decrypt(decryptedMessage);
    const messageString = this.arrayBufferToString(messageData);

    return {
      messageString,
      newCipher,
    };
  }

  public async generateKeys() {
    const { publicKey, privateKey } = await window.crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {
          name: 'SHA-512',
        },
      },
      true,
      ['encrypt', 'decrypt'],
    );

    return {
      publicKey,
      privateKey,
    };
  }

  public async generateKey() {
    const key = await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );

    return key;
  }

  public async exportKey(key: CryptoKey, type: 'private' | 'public') {
    const keyBuffer = await window.crypto.subtle.exportKey(
      type === 'private' ? 'pkcs8' : 'spki',
      key,
    );
    const keyString = this.arrayBufferToString(keyBuffer);
    const keyBase64 = btoa(keyString);

    let pem = `-----BEGIN PRIVATE KEY-----\n${keyBase64}\n-----END PRIVATE KEY-----`;
    if (type === 'public') {
      pem = `-----BEGIN PUBLIC KEY-----\n${keyBase64}\n-----END PUBLIC KEY-----`;
    }

    return pem;
  }

  public async importKey(pem: string, type: 'private' | 'public') {
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = pem.substring(
      pemHeader.length,
      pem.length - pemFooter.length,
    );

    const binaryDerString = atob(pemContents);
    const binaryDer = this.stringToArrayBuffer(binaryDerString);

    const key = await crypto.subtle.importKey(
      type === 'private' ? 'pkcs8' : 'spki',
      binaryDer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-512',
      },
      true,
      [type === 'private' ? 'decrypt' : 'encrypt'],
    );

    return key;
  }
}

export const cryptoController = new CryptoController();
