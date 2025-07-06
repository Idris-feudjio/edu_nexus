/// I need to create a generic SearchQueryDto that can be used to convert query parameters into a search query object.
// This will allow us to handle search queries in a more structured way.
// The SearchQueryDto should be able to handle different types of search queries, such as text search, range search, etc.
// The SearchQueryDto should also be able to handle pagination and sorting.
// Below is a basic implementation of the SearchQueryDto:
// src/common/dto/search-query.dto.ts
import { IsOptional, IsString, IsNumber, IsArray, IsObject } from 'class-validator';

export class SearchQueryDto<Q>{
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsArray()
    filters?: string[];

    @IsOptional()
    @IsObject()
    fieldFilters?: Record<string, (string | number|boolean)[]>; 


    @IsOptional()
    @IsNumber()
    page?: number;

    @IsOptional()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsString()
    order?: 'asc' | 'desc';
    constructor(partial: Partial<SearchQueryDto<Q>>) {
        Object.assign(this, partial);
    }
 
  
    static fromString<Q>(queryString: string): SearchQueryDto<Q> {
        const params = new URLSearchParams(queryString);
        const filters = params.getAll('filters');
        const fieldFilters: Record<string, (string | number)[]> = {};
        params.forEach((value, key) => {
            if (key.startsWith('fieldFilters.')) {
                const fieldKey = key.replace('fieldFilters.', '');
                if (!fieldFilters[fieldKey]) {
                    fieldFilters[fieldKey] = [];
                }
                fieldFilters[fieldKey].push(value);
            }
        });
        return new SearchQueryDto<Q>({
            search: params.get('search') || undefined,
            filters: filters.length ? filters : undefined,
            fieldFilters: Object.keys(fieldFilters).length ? fieldFilters : undefined,
            page: params.has('page') ? parseInt(params.get('page')!, 10) : undefined,
            limit: params.has('limit') ? parseInt(params.get('limit')!, 10) : undefined,
            sortBy: params.get('sortBy') || undefined,
            order: params.get('order') as 'asc' | 'desc' || undefined
        });
    }
    toQueryString(): string {
        const params = new URLSearchParams();
        if (this.search) params.set('search', this.search);
        if (this.filters) this.filters.forEach(filter => params.append('filters', filter));
        if (this.fieldFilters) {
            for (const [key, values] of Object.entries(this.fieldFilters)) {
                values.forEach(value => params.append(`fieldFilters.${key}`, value.toString()));
            }
        }
        if (this.page) params.set('page', this.page.toString());
        if (this.limit) params.set('limit', this.limit.toString());
        if (this.sortBy) params.set('sortBy', this.sortBy);
        if (this.order) params.set('order', this.order);
        return params.toString();
    }

    toQueryObject(): Record<string, any> {
        const queryObject: Record<string, any> = {};
        if (this.search) queryObject.search = this.search;
        if (this.filters) queryObject.filters = this.filters;
        if (this.fieldFilters) queryObject.fieldFilters = this.fieldFilters;
        if (this.page) queryObject.page = this.page;
        if (this.limit) queryObject.limit = this.limit;
        if (this.sortBy) queryObject.sortBy = this.sortBy;
        if (this.order) queryObject.order = this.order;
        return queryObject;
    }

    toObject(): Record<string, any> {
        return {
            search: this.search,
            filters: this.filters,
            fieldFilters: this.fieldFilters,
            page: this.page,
            limit: this.limit,
            sortBy: this.sortBy,
            order: this.order
        };
    }
    toJSON(): Record<string, any> {
        return this.toObject();
    }
    

}
 