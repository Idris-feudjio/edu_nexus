import { UserData, UserDto } from "./user.dto";

import { Prisma, User } from "@prisma/client";
import { IsBoolean, IsEmail, IsNotEmpty, IsString, } from "class-validator";

export class CreateStudentDto{ 
      @IsEmail()
      @IsNotEmpty()
      email: string;
    
      @IsString()
      @IsNotEmpty()
      firstName: string;
    
      @IsString()
      @IsNotEmpty()
      lastName: string;
    
      @IsString()
      @IsNotEmpty()
      password: string;
    
      role?: User["role"] = "STUDENT";
     
      @IsBoolean({})
      isActive?: boolean=true;
} 
