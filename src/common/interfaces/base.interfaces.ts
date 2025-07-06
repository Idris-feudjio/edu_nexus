export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams {
  [key: string]: any; // Dynamic filter parameters
    search?: string; // Optional search term
    searchFields?: string[]; // Fields to search in
}


export interface BaseService<T extends BaseEntity> {
    create(data: Partial<T>): Promise<T>;
    update(id: number, data: Partial<T>): Promise<T>;
    findById(id: number): Promise<T | null>;
    findAll(filter?: FilterParams, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
    delete(id: number): Promise<void>;
    }
export interface BaseRepository<T extends BaseEntity> {
    create(data: Partial<T>): Promise<T>;   
    update(id: number, data: Partial<T>): Promise<T>;
    findById(id: number): Promise<T | null>;
    findAll(filter?: FilterParams, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
    delete(id: number): Promise<void>;

     }
export interface BaseDto<T extends BaseEntity> {
    id: number;
    createdAt: Date;
    updatedAt: Date;    
    toEntity(): T;
    toJSON(): Record<string, any>;
    toString(): string;
    toObject(): Record<string, any>;
    toPlainObject(): Record<string, any>;
    toDto(): this;
    fromEntity(entity: T): this;
    fromJson(json: string): this;

}
export interface BaseEntityService<T extends BaseEntity, D extends BaseDto<T>> {
    create(dto: D): Promise<T>;
    update(id: number, dto: D): Promise<T>;
    findById(id: number): Promise<T | null>;
    findAll(filter?: FilterParams, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
    delete(id: number): Promise<void>;
    toDto(entity: T): D;
    toEntity(dto: D): T;
}
export interface BaseEntityRepository<T extends BaseEntity, D extends BaseDto<T>> {
    create(dto: D): Promise<T>;
    update(id: number, dto: D): Promise<T>;
    findById(id: number): Promise<T | null>;
    findAll(filter?: FilterParams, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
    delete(id: number): Promise<void>;
    toDto(entity: T): D;
    toEntity(dto: D): T;
}
export interface BaseEntityFactory<T extends BaseEntity> {
    create(data: Partial<T>): T;
    fromDto(dto: BaseDto<T>): T;
    fromObject(obj: Record<string, any>): T;
    fromJson(json: string): T;
    fromPlainObject(plainObj: Record<string, any>): T;
}
 
export interface BaseEntityTransformer<T extends BaseEntity, D extends BaseDto<T>> {
    transformToDto(entity: T): D;
    transformToEntity(dto: D): T;
    transformToObject(entity: T): Record<string, any>;
    transformToJson(entity: T): string;
    transformToPlainObject(entity: T): Record<string, any>;
}

export interface BaseEntityValidator<T extends BaseEntity> {
    validateCreate(data: Partial<T>): Promise<void>;
    validateUpdate(id: number, data: Partial<T>): Promise<void>;
    validateFindById(id: number): Promise<void>;
    validateDelete(id: number): Promise<void>;
    validateFilter(filter: FilterParams): Promise<void>;
    validatePagination(pagination: PaginationParams): Promise<void>;
}
 
 
export interface BaseEntityCache<T extends BaseEntity> {
    cacheCreate(entity: T): void;
    cacheUpdate(entity: T): void;
    cacheFindById(id: number): Promise<T | null>;
    cacheFindAll(filter?: FilterParams, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
    cacheDelete(id: number): void;
    clearCache(): void;
}
export interface BaseEntitySearch<T extends BaseEntity> {
    search(filter: FilterParams, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
    searchById(id: number): Promise<T | null>;
    searchByField(field: string, value: any, pagination?: PaginationParams): Promise<PaginatedResult<T>>;
}
 