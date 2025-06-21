 import { PrismaClient } from "@prisma/client";

import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/abstracts"; 
import { PrismaService } from "src/prisma/prisma.service"; 
import { DepartementDto } from "../dto";

@Injectable()
export class DepartementRepository extends BaseRepository<DepartementDto> {
  protected model: PrismaClient['departement']

    constructor(private readonly prisma: PrismaService) {
        super();
        this.model = prisma.departement; // Set the model to the Prisma department model
    }
}
