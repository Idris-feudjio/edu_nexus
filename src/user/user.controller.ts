import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard'; 
import { User } from 'generated/prisma';
import { GetUser } from 'src/auth/decorator';



@UseGuards(JwtGuard)
@Controller('users')
export class UserController { 
     @Get('me')
     async getMe(@GetUser()user:User) { 
       return user;
     }


}
