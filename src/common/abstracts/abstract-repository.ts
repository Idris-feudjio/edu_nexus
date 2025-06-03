import { Prisma, PrismaClient } from "generated/prisma";
import { AbstractCrud } from "./abstract-crud";
import { PrismaService } from "src/prisma/prisma.service";
import { SearchQueryDto } from "../dto";
import { log } from "console";


export abstract class BaseRepository<T> implements AbstractCrud<T> {
  protected abstract model: any;

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create({ data });
  }

  async search(query: string): Promise<T[]> {
    return await this.model.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          {  description: { contains: query, mode: 'insensitive' }},
        ],
      },
    }); 
  }

async searchAll(query: SearchQueryDto<T>): Promise<T[]> {
  console.log(`Searching with query: ${JSON.stringify(query)}`);
  
    const { search, filters: filterConditions, page, limit, sortBy, order, fieldFilters } = query;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }, 
      ];
    }
    if (filterConditions) {
      filterConditions.forEach((filter: string) => {
        const [key, value] = filter.split(':');
        if (value) {
          where[key] = { contains: value, mode: 'insensitive' };
        } else {
          where[key] = { not: null }; // Handle filters without values
        }
      });
    }
    if (fieldFilters) {
      for (const [key, value] of Object.entries(fieldFilters)) {
        where[key] = { in: value };
      }
    }
    const skip = (page || 1 - 1) * (limit || 10);
    const take = limit || 10;
    const orderBy: any = sortBy ? { [sortBy]: order || 'asc' } : undefined;
    return await this.model.findMany({
      where,
      skip,
      take,
      orderBy,
    });
   
  }
 
 //async findById(id: number): Promise<T | null> {
 //  return await this.model.findUnique({ where: { id } });
 //}

  async findById(key: any): Promise<T | null> {
   return await this.model.findUnique({ where: { key } });
 }

  async update(id: number, data: Partial<T>): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<T> {
    return await this.model.delete({ where: { id } });
  }

  async count(filters: SearchQueryDto<T>): Promise<number> {
    return await this.model.count({
      where: {
        ...filters.toQueryObject(),
      },
    });
     
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }
}
