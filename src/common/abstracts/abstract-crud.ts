export interface AbstractCrud<T> {
     create(data: Partial<T>): Promise<T>;
     findAll(): Promise<T[]>;
     findById(id: number): Promise<T | null>;
     update(id: number, data: Partial<T>): Promise<T>;
     delete(id: number): Promise<T>;
     count(): Promise<number>;
     exists(id: number): Promise<boolean>;
}

