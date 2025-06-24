import { PaginateDataResponse, SearchQueryDto } from "../dto";
import { AbstractCrud } from "./abstract-crud";
import { BaseRepository } from "./abstract-repository";

export abstract class BaseService<D,S> implements AbstractCrud<D,S> {
  protected abstract repository: BaseRepository<D,S>;
 
  async create(data: Partial<D>): Promise<S> {
    return await this.repository.create(data);
  }

async search(query: string): Promise<S[]> {
    return await this.repository.search(query);
  }

  async searchAll(filters: SearchQueryDto<D>):Promise<PaginateDataResponse<S>> {
    return await this.repository.searchAll(filters);
  }

  async findById(id: number): Promise<S | null> {
    return await this.repository.findById(id);
  }

    async findBy(fieldName: any): Promise<S| null> {
    return await this.repository.findBy(fieldName);
  }

  async update(id: number, data: Partial<D>): Promise<S> {
    return await this.repository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return await this.repository.delete(id);
  }

  async count(filters:SearchQueryDto<D>): Promise<number> {
    return await this.repository.count(filters);
  }

  async exists(id: number): Promise<boolean> {
    return await this.repository.exists(id);
  }
}