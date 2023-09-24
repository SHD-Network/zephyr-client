import {
  IJsonIdentity,
  IJsonRemoteIdentity,
  Identity,
  RemoteIdentity,
  AsymmetricRatchet,
} from '2key-ratchet';
import { IDBPDatabase, openDB } from 'idb';

export class StorageController {
  public static STORAGE_NAME = 'zephyr';
  public static IDENTITY_STORAGE = 'identity';
  public static SESSION_STORAGE = 'session';
  public static REMOTE_STORAGE = 'remoteIdentity';

  public static async create() {
    const db = await openDB(this.STORAGE_NAME, undefined, {
      upgrade(db) {
        db.createObjectStore(StorageController.IDENTITY_STORAGE);
        db.createObjectStore(StorageController.SESSION_STORAGE);
        db.createObjectStore(StorageController.REMOTE_STORAGE);
      },
    });

    return new StorageController(db);
  }

  protected db: IDBPDatabase;

  private constructor(db: IDBPDatabase) {
    this.db = db;
  }

  public async loadIdentity() {
    const json: IJsonIdentity = await this.db
      .transaction(StorageController.IDENTITY_STORAGE)
      .objectStore(StorageController.IDENTITY_STORAGE)
      .get('identity');
    let res: Identity | null = null;

    if (json) {
      res = await Identity.fromJSON(json);
    }

    return res;
  }

  public async saveIdentity(value: Identity) {
    const json = await value.toJSON();
    const tx = this.db.transaction(
      StorageController.IDENTITY_STORAGE,
      'readwrite',
    );
    tx.objectStore(StorageController.IDENTITY_STORAGE).put(json, 'identity');
    return tx.done;
  }

  public async loadRemoteIdentity(key: string) {
    const json: IJsonRemoteIdentity = await this.db
      .transaction(StorageController.REMOTE_STORAGE)
      .objectStore(StorageController.REMOTE_STORAGE)
      .get(key);
    let res: RemoteIdentity | null = null;

    if (json) {
      res = await RemoteIdentity.fromJSON(json);
    }

    return res;
  }

  public async deleteRemoteIdentity(key: string) {
    await this.db
      .transaction(StorageController.REMOTE_STORAGE, 'readwrite')
      .objectStore(StorageController.REMOTE_STORAGE)
      .delete(key);

    return;
  }

  public async saveRemoteIdentity(key: string, value: RemoteIdentity) {
    const json = await value.toJSON();
    const tx = this.db.transaction(
      StorageController.REMOTE_STORAGE,
      'readwrite',
    );
    tx.objectStore(StorageController.REMOTE_STORAGE).put(json, key);
    return tx.done;
  }

  public async loadSession(key: string) {
    const json: any = await this.db
      .transaction(StorageController.SESSION_STORAGE)
      .objectStore(StorageController.SESSION_STORAGE)
      .get(key);
    let res: AsymmetricRatchet | null = null;

    if (json) {
      const identity = await this.loadIdentity();
      if (!identity) {
        throw new Error('Identity is empty');
      }

      const remoteIdentity = await this.loadRemoteIdentity(key);
      if (!remoteIdentity) {
        throw new Error('Remote identity is empty');
      }

      res = await AsymmetricRatchet.fromJSON(identity, remoteIdentity, json);
    }

    return res;
  }

  public async saveSession(key: string, value: AsymmetricRatchet) {
    const json = await value.toJSON();
    const tx = this.db.transaction(
      StorageController.SESSION_STORAGE,
      'readwrite',
    );
    tx.objectStore(StorageController.SESSION_STORAGE).put(json, key);
    return tx.done;
  }

  public async deleteSession(key: string) {
    await this.db
      .transaction(StorageController.SESSION_STORAGE, 'readwrite')
      .objectStore(StorageController.SESSION_STORAGE)
      .delete(key);

    return;
  }
}
