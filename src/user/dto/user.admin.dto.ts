import { UserData, UserDto } from "./user.dto";

import { IsBoolean, IsEmail, IsNotEmpty, IsString, } from "class-validator";

export class CreateAdminDto{ 
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
      role: "ADMIN" | "PEDAGOGIC" | "TEACHER" | "STUDENT";
     
      @IsBoolean({})
      isActive?: boolean=true;
} 
