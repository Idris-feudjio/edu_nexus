import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiTags, ApiOperation, PartialType } from '@nestjs/swagger';

export class RequestOtpDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
    }


    const user:UserDtos ={}
    class IUser{
        @IsString()
        id:number;
        @IsString()
        name:string
        @IsEmail()
        @IsString()
        email:string
        }
 
class UserDtos extends PartialType(IUser){}
    
