 

import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/abstracts";  
import { FiliereDto, FiliereSummaryDto } from "../dto";
import { PrismaClient } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class FiliereRepository extends BaseRepository<FiliereDto,FiliereSummaryDto> {
    protected model:PrismaClient['filiere'] 

        constructor(private readonly prisma: PrismaService) {
            super();
            this.model = prisma.filiere; // Set the model to the Prisma department model
        }
}