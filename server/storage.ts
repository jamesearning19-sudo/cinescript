import { type UploadedFile } from "@shared/schema";

export interface IStorage {
  saveFileMetadata(file: UploadedFile): Promise<UploadedFile>;
  getFileMetadata(filename: string): Promise<UploadedFile | undefined>;
  getAllFiles(): Promise<UploadedFile[]>;
}

export class MemStorage implements IStorage {
  private files: Map<string, UploadedFile>;

  constructor() {
    this.files = new Map();
  }

  async saveFileMetadata(file: UploadedFile): Promise<UploadedFile> {
    this.files.set(file.filename, file);
    return file;
  }

  async getFileMetadata(filename: string): Promise<UploadedFile | undefined> {
    return this.files.get(filename);
  }

  async getAllFiles(): Promise<UploadedFile[]> {
    return Array.from(this.files.values());
  }
}

export const storage = new MemStorage();
