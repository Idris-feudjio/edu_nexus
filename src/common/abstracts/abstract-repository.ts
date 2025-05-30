import { Prisma, PrismaClient } from "generated/prisma";
import { AbstractCrud } from "./abstract-crud";
import { PrismaService } from "src/prisma/prisma.service";


export abstract class BaseRepository<T> implements AbstractCrud<T> {
  protected abstract model: any;

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create({ data });
  }

  async findAll(): Promise<T[]> {
    return await this.model.findMany();
  }

  async findById(id: number): Promise<T | null> {
    return await this.model.findUnique({ where: { id } });
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

  async count(): Promise<number> {
    return await this.model.count();
  }

  async exists(id: number): Promise<boolean> {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }
}
