import type { FileRepo } from "#files/domain/repo";
import type { FileEntryAttrs } from "#files/domain/struct/attrs";
import type { UpdateFileCommand } from "#files/domain/struct/update-file";
import { JsonRepository } from "../../app/infra/json-repo";

const path = import.meta.dir + '/domains.json';

class FileJsonRepo implements FileRepo {
  protected jsonRepo: JsonRepository<FileEntryAttrs>;

  constructor() {
    this.jsonRepo = new JsonRepository(path);
  }

  async findFile(id: string): Promise<FileEntryAttrs | undefined> {
    return this.jsonRepo.find(id);
  }

  async editFile(id: string, patch: UpdateFileCommand['attrs']): Promise<{ changes: number }> {
    const existing = await this.jsonRepo.find(id);
    if (!existing) {
      throw Error('File not exist');
    }

    const updated = { ...existing, ...patch };
    await this.jsonRepo.update(id, updated);
    return { changes: 1 };
  }

  async getFiles(): Promise<FileEntryAttrs[]> {
    return this.jsonRepo.getAll();
  }

  async addFile(attrs: FileEntryAttrs): Promise<{ changes: number }> {
    const exist = await this.jsonRepo.find(attrs.id);
    if (exist) {
      throw new Error('File already exists');
    }
    await this.jsonRepo.update(attrs.id, attrs);
    return { changes: 1 };
  }

  async deleteFile(id: string): Promise<{ changes: number; }> {
    await this.jsonRepo.delete(id);
    return { changes: 1 }
  }
}

export const fileJsonRepo = new FileJsonRepo();
