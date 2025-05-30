import { AbstractCrud } from "./abstract-crud";
import { BaseRepository } from "./abstract-repository";

export abstract class BaseService<T> implements AbstractCrud<T> {
  protected abstract repository: BaseRepository<T>;
 
  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.findAll();
  }

  async findById(id: number): Promise<T | null> {
    return await this.repository.findById(id);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    return await this.repository.update(id, data);
  }

  async delete(id: number): Promise<T> {
    return await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }

  async exists(id: number): Promise<boolean> {
    return await this.repository.exists(id);
  }
}