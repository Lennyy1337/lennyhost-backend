import { Readable } from "stream";

export interface Storage {
  uploadFile(key: string, data: Readable, contentType: string): Promise<void>;
  generateSignedUrl(key: string, expirationTime?: number): Promise<string>;
  deleteFile(key: string): Promise<void>;
  listFiles(): Promise<string[] | undefined>;
  copyFile(sourceKey: string, destinationKey: string): Promise<void>;
  createFolder(folderPath: string): Promise<void>;
  getFileSize(key: string): Promise<number>;
  renameFile(oldKey: string, newKey: string): Promise<void>;
}

export abstract class BaseStorage {
  protected storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  abstract initialize(): Promise<void>;

  async uploadFile(
    key: string,
    data: Readable,
    contentType: string
  ): Promise<void> {
    return this.storage.uploadFile(key, data, contentType);
  }

  async generateSignedUrl(
    key: string,
    expirationTime?: number
  ): Promise<string> {
    return this.storage.generateSignedUrl(key, expirationTime);
  }

  async deleteFile(key: string): Promise<void> {
    return this.storage.deleteFile(key);
  }

  async listFiles(): Promise<string[] | undefined> {
    return this.storage.listFiles();
  }

  async copyFile(sourceKey: string, destinationKey: string): Promise<void> {
    return this.storage.copyFile(sourceKey, destinationKey);
  }

  async createFolder(folderPath: string): Promise<void> {
    return this.storage.createFolder(folderPath);
  }

  async getFileSize(key: string): Promise<number> {
    return this.storage.getFileSize(key);
  }

  async renameFile(oldKey: string, newKey: string): Promise<void> {
    return this.storage.renameFile(oldKey, newKey);
  }
}
