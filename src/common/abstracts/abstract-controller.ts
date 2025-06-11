import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AbstractCrud } from "./abstract-crud";
import { BaseService } from "./abstract-services";
import { PaginateDataResponse, SearchQueryDto } from "../dto";


export abstract class AbstractController<T> implements AbstractCrud<T> {
  protected abstract service: BaseService<T>;
 

    @Post('create')
    async create(@Body() data: Partial<T>): Promise<T> {
        return this.service.create(data);
    }

    @Get(':id/detail')
    async findById(@Param('id') id: number) {
        return this.service.findById(id);
    }

    @Put(':id/update')
    async update(@Param('id') id: number, @Body() data: Partial<T>) {
        return this.service.update(id, data);
    }

    @Delete(':id/delete')
    async delete(@Param('id') id: number): Promise<void> {
        return this.service.delete(id);
    }

    @Post('count')
    async count(@Body() filters: SearchQueryDto<T>): Promise<number> {
        return this.service.count(filters);
    }

    @Get(':id/exists')
    async exists(@Param('id') id: number): Promise<boolean> {
        return this.service.exists(id);
    }

    @Get('search')
    async search(@Param('query') query: string): Promise<T[]> {
         
        return this.service.search(query);
    }

    @Post('search-all')
    async searchAll(@Body() filters: SearchQueryDto<T>):Promise<PaginateDataResponse<T>> {
        console.log(filters);
        
        return this.service.searchAll(filters);
    } 
}
