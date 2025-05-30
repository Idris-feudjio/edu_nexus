import { AbstractCrud } from "./abstract-crud";
import { BaseService } from "./abstract-services";

export abstract class AbstractController<T> implements AbstractCrud<T>{
    protected abstract service: BaseService<T>;
    
    async create(data: Partial<T>): Promise<T> {
        return await this.service.create(data);
    }
    
    async findAll(): Promise<T[]> {
        return await this.service.findAll();
    }
    
    async findById(id: number): Promise<T | null> {
        return await this.service.findById(id);
    }
    
    async update(id: number, data: Partial<T>): Promise<T> {
        return await this.service.update(id, data);
    }
    
    async delete(id: number): Promise<T> {
        return await this.service.delete(id);
    }
    
    async count(): Promise<number> {
        return await this.service.count();
    }
    
    async exists(id: number): Promise<boolean> {
        return await this.service.exists(id);
    }
}
