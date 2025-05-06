import { IsEmail, IsNotEmpty, IsString } from "class-validator"; 

export class RequestOtpDto {
    @IsEmail()
    @IsNotEmpty()
    @IsString()
    email: string;
    }

    
