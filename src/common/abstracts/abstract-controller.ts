import { Body, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AbstractCrud } from "./abstract-crud";
import { BaseService } from "./abstract-services";
import { PaginateDataResponse, SearchQueryDto } from "../dto";


export abstract class AbstractController<D,S> implements AbstractCrud<D,S> {
  protected abstract service: BaseService<D,S>;
 

    @Post('create')
    async create(@Body() data: Partial<D>): Promise<S> {
        console.log(data);
        
        return this.service.create(data);
    }

    @Get(':id/detail')
    async findById(@Param('id') id: number): Promise<S | null>{
        return this.service.findById(id);
    }

    @Put(':id/update')
    async update(@Param('id') id: number, @Body() data: Partial<D>):Promise<S> {
        return this.service.update(id, data);
    }

    @Delete(':id/delete')
    async delete(@Param('id') id: number): Promise<void> {
        return this.service.delete(id);
    }

    @Post('count')
    async count(@Body() filters: SearchQueryDto<D>): Promise<number> {
        return this.service.count(filters);
    }

    @Get(':id/exists')
    async exists(@Param('id') id: number): Promise<boolean> {
        return this.service.exists(id);
    }

    @Get('search')
    async search(@Param('query') query: string): Promise<S[]> {
         
        return this.service.search(query);
    }

    @Post('search-all')
    async searchAll(@Body() filters: SearchQueryDto<D>):Promise<PaginateDataResponse<S>> {
        return this.service.searchAll(filters);
    } 
}
