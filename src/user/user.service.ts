import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
   
    constructor(private readonly prismaService: PrismaService) {
        // Constructor logic if needed
    }

    getMe(email: string) {
        return this.prismaService.user.findUnique({
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
}
