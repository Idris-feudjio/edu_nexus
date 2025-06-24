import { BaseRepository } from "src/common/abstracts";
import { AnnouncementsModel, DocumentSummaryDto } from "../dto";
import { PrismaClient } from "@prisma/client";


import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AnnouncementRepository extends BaseRepository<AnnouncementsModel,DocumentSummaryDto>{
    protected model: PrismaClient['document'];
    
     constructor(private readonly prisma: PrismaService) {
        super();
        this.model = prisma.document; // Set the model to the Prisma user model
    }

}