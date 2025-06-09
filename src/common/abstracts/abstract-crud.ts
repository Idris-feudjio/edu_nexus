import { SearchQueryDto } from "../dto";

 
export interface AbstractCrud<T> {
     create(data: Partial<T>): Promise<T>; 
     search(query: string): Promise<T[]>;
     searchAll(filters: SearchQueryDto<T>): Promise<T[]>;
     findById(id: number):any;// Promise<T | null>;
     update(id: number, data: Partial<T>): Promise<T>;
     delete(id: number): Promise<void>;
     count(filters: SearchQueryDto<T>): Promise<number>;
     exists(id: number): Promise<boolean>;
}

