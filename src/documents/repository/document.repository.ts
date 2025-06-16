import { BaseRepository } from "src/common/abstracts";
import { DocumentModel } from "../dto";
import { PrismaClient, Role } from "@prisma/client";


import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DocumentRepository extends BaseRepository<DocumentModel>{
    protected model: PrismaClient['document'];
    
     constructor(private readonly prisma: PrismaService) {
        super();
        this.model = prisma.document; // Set the model to the Prisma user model
    }

}