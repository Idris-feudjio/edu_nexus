import { PrismaClient, Role } from "@prisma/client";

import { Injectable } from "@nestjs/common";
import { BaseRepository } from "src/common/abstracts";
import { UserData } from "../dto";
import { PrismaService } from "src/prisma/prisma.service";


@Injectable()
export class UserRepository extends BaseRepository<UserData,UserData> {
    // Extend BaseRepository with UserData type
    // Set the model to the Prisma user model
    // This allows us to use the methods from BaseRepository with UserData
    protected model: PrismaClient['user'];

    constructor(private readonly prisma: PrismaService) {
        super();
        this.model = prisma.user; // Set the model to the Prisma user model
    }

    async getMe(email: string) {
        return this.model.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }

    async getAllUserByRole(role: Role) {
        return await this.model.findMany({
            where: { role },
            select: {
                id: true,
                email: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
 
}