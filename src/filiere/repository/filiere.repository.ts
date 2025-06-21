 

import { Injectable } from "@nestjs/common";
import { PrismaClient } from "generated/prisma";
import { BaseRepository } from "src/common/abstracts";  
import { FiliereDto } from "../dto";


@Injectable()
export class FiliereRepository extends BaseRepository<FiliereDto> {
    protected model:PrismaClient['filiere'] 
}