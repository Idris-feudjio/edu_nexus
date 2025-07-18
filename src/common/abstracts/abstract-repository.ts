import { AbstractCrud } from "./abstract-crud";
import { PrismaService } from "src/prisma/prisma.service";
import { PaginateDataResponse, SearchQueryDto } from "../dto";


export abstract class BaseRepository<D,S> implements AbstractCrud<D,S> {
  protected abstract model: any;

  async create(data: Partial<D>): Promise<S> {
    return await this.model.create({ data });
  }

  async search(query: string): Promise<S[]> {
    return await this.model.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          {  description: { contains: query, mode: 'insensitive' }},
        ],
      },
    }); 
  }

async searchAll(query: SearchQueryDto<D>): Promise<PaginateDataResponse<S>> {
  
    const { search, filters: filterConditions, page, limit, sortBy, order, fieldFilters } = query;
    const where: any = {};
    if (search) {
      const stringFields = Object.keys(this.model.fields).filter(
        (field: string) => this.model.fields[field].type === 'String'
      );
      where.OR = stringFields.map((field: string) => ({
        [field]: { contains: search, mode: 'insensitive' }
      }));
     
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
    const skip = ((page || 1) - 1) * (limit || 10);
    const take = limit || 10;
    const orderBy: any = sortBy ? { [sortBy]: order || 'asc' } : undefined;
    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        skip,
        take,
        orderBy,
      }),
      this.model.count({ where }),
    ]);
    return {
      data,
      total,
      page: page || 1,
      totalPages: Math.ceil(total / (limit || 10)),
    };
  }

  async findById(id: any): Promise<S | null> {
   return await this.model.findUnique({ where: { id } });
 }

  async findBy(field: any): Promise<S | null> {
   return await this.model.findUnique({ where: { ...field } });
 }

  async update(id: number, data: Partial<D>): Promise<S> {
    return await this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    return await this.model.delete({ where: { id } });
  }

  async count(filters: SearchQueryDto<D>): Promise<number> {
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
